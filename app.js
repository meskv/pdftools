const $=s=>document.querySelector(s),H=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const S={f:[],it:[]},say=m=>{const e=$('#st');if(e)e.textContent=m};
const LIB=['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'];
const load=u=>new Promise((r,j)=>{const s=H('script');s.src=u;s.onload=r;s.onerror=j;document.head.append(s)});
let libs;const ready=()=>libs??=Promise.all(LIB.map(load)).then(async()=>{pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(await(await fetch(LIB[1].replace('pdf.min','pdf.worker.min'))).blob())});
const save=(n,d,t)=>{const a=H('a');a.href=URL.createObjectURL(d instanceof Blob?d:new Blob([d],{type:t}));a.download=n;document.body.append(a);a.click();a.remove()};
const card=t=>`<a class="tool" href="${t.id}.html"><i style="background:${CATS[t.c][1]}">${t.i}</i><b>${t.n}</b><span>${t.d}</span></a>`;
async function build(it){const d=await PDFLib.PDFDocument.create();
 for(const i of it){const f=S.f[i.f];f.doc??=await PDFLib.PDFDocument.load(f.buf,{ignoreEncryption:true});
  const[p]=await d.copyPages(f.doc,[i.p-1]);if(i.r)p.setRotation(PDFLib.degrees((p.getRotation().angle+i.r)%360));d.addPage(p)}
 return d}
function home(){
 $('#app').innerHTML=`<section class="hero"><h1>Every PDF tool you need, right in your browser</h1><p>Merge, split, organize and convert PDFs. Free, private, and nothing is ever uploaded.</p><input id="q" type="search" placeholder="Search tools, for example “merge”"></section><nav class="chips" id="chips"></nav><div class="tools" id="tools"></div>`;
 let cat='',q='';
 const draw=()=>{$('#tools').innerHTML=TOOLS.filter(t=>(!cat||t.c==cat)&&(t.n+t.d).toLowerCase().includes(q)).map(card).join('')||'<p>No tools match your search.</p>';
  $('#chips').innerHTML=[['','All'],...Object.entries(CATS).map(([k,v])=>[k,v[0]])].map(([k,n])=>`<button class="${k==cat?'on':''}" data-k="${k}">${n}</button>`).join('')};
 $('#chips').onclick=e=>{if(e.target.dataset.k!=null){cat=e.target.dataset.k;draw()}};
 $('#q').oninput=e=>{q=e.target.value.toLowerCase();draw()};draw()}
function tool(T){
 const mode=M[T.m],img=T.img,kb=n=>(n/1024|0)+' KB';let D;
 document.title=T.n+' – PDF Tools';
 $('#app').innerHTML=`<section class="head"><h1>${T.n}</h1><p>${T.d}</p></section>
 <div id="dz" class="dz"><div class="big">${T.i}</div><h2>Drop ${img?'images':'PDF files'} here</h2><button class="btn" id="pick">Select ${img?'images':T.multi?'PDF files':'a PDF'}</button><p>Processed on your device. Nothing is uploaded.</p><input id="in" type="file" hidden accept="${img?'image/*':'application/pdf'}" ${T.multi?'multiple':''}></div>
 <div id="ws" hidden><div class="grid" id="grid" data-m="${T.m}"></div><aside><h3>${T.n}</h3><div id="tb"></div><div id="ops" style="display:contents"></div><p id="info"></p><button class="btn go" id="go">${T.b||T.n}</button><p id="st" role="status"></p></aside></div>
 <h2 class="more">More tools</h2><div class="tools">${TOOLS.filter(x=>x!==T).map(card).join('')}</div>`;
 $('#ops').innerHTML=(T.o||[]).map(o=>`<label>${o.l}${o.v?`<select id="o_${o.k}">${o.v.map(([a,b])=>`<option value="${a}">${b}</option>`).join('')}</select>`:`<input id="o_${o.k}" value="${o.d||''}" placeholder="${o.p||''}">`}</label>`).join('');
 const opts=()=>Object.fromEntries((T.o||[]).map(o=>[o.k,$('#o_'+o.k).value]));
 const use=()=>T.m=='mark'?S.it.filter(i=>!i.x):T.m=='keep'?S.it.filter(i=>i.x):S.it;
 const bt=(t,f)=>{const b=H('button','',t);b.onclick=e=>{e.stopPropagation();f()};return b};
 const rot=(i,a)=>{i.r=(i.r+a+360)%360;i.cv.style.transform=`rotate(${i.r}deg)${i.r%180?' scale(.75)':''}`};
 const pickAll=v=>{S.it.forEach(i=>{i.x=v;i.el.classList.toggle('sel',!!v)});info()};
 function info(){const n=use().length,t=S.it.length;$('#info').textContent=`${n} of ${t} ${img?'image':'page'}${t>1?'s':''} ${T.m=='mark'?'will be kept':T.m=='keep'?'selected':'included'}`;$('#go').disabled=!n}
 function draw(){$('#grid').replaceChildren(...S.it.map((i,k)=>{i.el.querySelector('.n').textContent=T.multi?`${k+1} · ${S.f[i.f].name}`:k+1;i.el.title=S.f[i.f].name;return i.el}))}
 function mk(i,cv){i.r=0;i.x=0;const e=i.el=H('div','pg');e.draggable=!!mode.drag;
  if(!cv){cv=new Image();cv.src=i.url}i.cv=cv;const th=H('div','th');th.append(cv);const bar=H('div','bar');e.append(th,H('span','n'),bar);
  if(mode.rot)bar.append(bt('⟲',()=>rot(i,-90)),bt('⟳',()=>rot(i,90)));
  if(mode.del)bar.append(bt('✕',()=>{S.it=S.it.filter(x=>x!==i);draw();info()}));
  if(mode.pick)e.onclick=()=>{i.x^=1;e.classList.toggle('sel',!!i.x);info()};
  if(mode.drag){e.ondragstart=()=>D=i;e.ondragover=v=>v.preventDefault();e.ondrop=()=>{if(!D||D===i)return;const a=S.it.indexOf(D);S.it.splice(a,1);S.it.splice(S.it.indexOf(i)+(a<S.it.indexOf(i)?1:0),0,D);draw()}}
  return i}
 async function add(list){
  const L=list.filter(f=>img?f.type.startsWith('image/'):/pdf$/i.test(f.type)||/\.pdf$/i.test(f.name));
  if(!L.length)return say('Please choose '+(img?'image':'PDF')+' files.');
  await ready();if(!T.multi){S.f=[];S.it=[]}
  $('#dz').hidden=1;$('#ws').hidden=0;
  for(const file of L){const fi=S.f.length,o={name:file.name};S.f.push(o);
   try{if(img){o.file=file;S.it.push(mk({f:fi,p:1,url:URL.createObjectURL(file)}))}
   else{o.buf=await file.arrayBuffer();o.pdf=await pdfjsLib.getDocument({data:new Uint8Array(o.buf.slice(0))}).promise;
    for(let p=1;p<=o.pdf.numPages;p++){say(`Reading ${file.name}: page ${p} of ${o.pdf.numPages}`);S.it.push(mk({f:fi,p},await RENDER(o.pdf,p,200/(await o.pdf.getPage(p)).getViewport({scale:1}).width)));if(p%6==0){draw();info()}}}}
   catch(e){say(`Couldn’t read ${file.name}. It may be password-protected or damaged.`)}}
  draw();info();if(!$('#st').textContent.startsWith('Couldn’t'))say('')}
 const tb=$('#tb');
 if(T.multi)tb.append(bt('+ Add files',()=>$('#in').click()));
 if(mode.rot&&T.m=='rot')tb.append(bt('⟲ All',()=>S.it.forEach(i=>rot(i,-90))),bt('⟳ All',()=>S.it.forEach(i=>rot(i,90))));
 if(mode.pick)tb.append(bt('Select all',()=>pickAll(1)),bt('Clear',()=>pickAll(0)));
 tb.append(bt('Start over',()=>location.reload()));
 $('#pick').onclick=()=>$('#in').click();
 $('#in').onchange=e=>{add([...e.target.files]);e.target.value=''};
 document.ondragover=e=>e.preventDefault();
 document.ondrop=e=>{e.preventDefault();const f=[...e.dataTransfer.files];if(f.length&&(T.multi||!S.it.length))add(f)};
 $('#go').onclick=async()=>{const g=$('#go');g.disabled=1;
  try{say('Working…');const o=opts(),it=use(),out=T.run?await T.run(it,o):await(async()=>{const d=await build(it);if(T.post)await T.post(d,o);return[[T.id+'.pdf',await d.save(),'application/pdf']]})();
   for(const[n,d,t]of out)save(n,d,t);
   say(T.id=='compress'?`Done. ${kb(S.f.reduce((a,f)=>a+f.buf.byteLength,0))} became ${kb(out[0][1].length)}.`:'Done. Your download has started.')}
  catch(e){say('Something went wrong: '+e.message)}g.disabled=0}}
const T0=TOOLS.find(t=>t.id==document.body.dataset.tool);T0?(T0.ed?editor(T0):tool(T0)):home();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
$('#theme').onclick=()=>{const t=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.t=t};
