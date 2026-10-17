// @ts-nocheck
// Imperative DOM module (drag-and-drop pages / click-to-place objects), mounted from a React page.
import { $, H, S, say, ready, save, build, RENDER, BLOB, PDFLib, pdfjsLib, handoff, base } from '../engine/pdf';
import { TOOLS } from '../tools';
import { M } from '../tools/modes';

export function mountPageTool(T:any,root:HTMLElement){
 const mode=M[T.m],img=T.img,kb=n=>(n/1024|0)+' KB';let D,DF,ord=[],hist=[];
 document.title=T.n+' – PDF Tools';
 root.innerHTML=`<section class="head"><h1>${T.n}</h1><p>${T.d}</p></section>
 <div id="dz" class="dz"><div class="big">${T.i}</div><h2>Drop ${img?'images':'PDF files'} here</h2><button class="btn" id="pick">Select ${img?'images':T.multi?'PDF files':'a PDF'}</button><p>Processed on your device. Nothing is uploaded.</p><input id="in" type="file" hidden accept="${img?'image/*':'application/pdf'}" ${T.multi?'multiple':''}></div>
 <div id="ws" hidden><div class="left"><div id="files" class="files"></div><div class="grid" id="grid" data-m="${T.m}"></div></div><aside><h3>${T.n}</h3><div id="tb"></div><div id="ops" style="display:contents"></div><p id="info"></p><button class="btn go" id="go">${T.b||T.n}</button><button class="btn ghost" id="keep" hidden></button><button class="btn ghost" id="undo" hidden>Undo last apply</button><label id="nx" hidden>Continue in another tool<select id="nxs"><option value="">Choose a tool…</option></select></label><p id="st" role="status"></p></aside></div>`;
 $('#ops').innerHTML=(T.o||[]).map(o=>`<label>${o.l}${o.v?`<select id="o_${o.k}">${o.v.map(([a,b])=>`<option value="${a}">${b}</option>`).join('')}</select>`:`<input id="o_${o.k}" value="${o.d||''}" placeholder="${o.p||''}">`}</label>`).join('');
 const opts=()=>Object.fromEntries((T.o||[]).map(o=>[o.k,$('#o_'+o.k).value]));
 const use=()=>T.m=='mark'?S.it.filter(i=>!i.x):T.m=='keep'?S.it.filter(i=>i.x):S.it;
 const bt=(t,f)=>{const b=H('button','',t);b.onclick=e=>{e.stopPropagation();f()};return b};
 const rot=(i,a)=>{i.r=(i.r+a+360)%360;i.cv.style.transform=`rotate(${i.r}deg)${i.r%180?' scale(.75)':''}`};
 const pickAll=v=>{S.it.forEach(i=>{i.x=v;i.el.classList.toggle('sel',!!v)});info()};
 function info(){const n=use().length,t=S.it.length;$('#info').textContent=`${n} of ${t} ${img?'image':'page'}${t>1?'s':''} ${T.m=='mark'?'will be kept':T.m=='keep'?'selected':'included'}`;$('#go').disabled=!n;$('#keep').disabled=!n;$('#undo').hidden=!hist.length}
 function draw(){$('#grid').replaceChildren(...S.it.map((i,k)=>{i.el.querySelector('.n').textContent=T.multi?`${k+1} · ${S.f[i.f].name}`:k+1;i.el.title=S.f[i.f].name;if(T.multi&&mode.drag)i.el.style.borderTopColor=col(i.f);return i.el}));drawFiles()}
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
  await ready();if(!T.multi){S.f=[];S.it=[];ord=[]}
  $('#dz').hidden=1;$('#ws').hidden=0;
  for(const file of L){const fi=S.f.length,o={name:file.name};S.f.push(o);ord.push(fi);
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
  const col=fi=>`hsl(${ord.indexOf(fi)*67%360} 70% 55%)`;
 // Step 1 (merge): files appear as cards you can reorder before merging.
 function drawFiles(){const tr=$('#files'),act=ord.filter(f=>S.it.some(i=>i.f===f));
  if(!tr||!(T.multi&&mode.drag)||act.length<2){tr&&tr.replaceChildren();return}
  tr.replaceChildren(...act.map((fi,k)=>{const o=S.f[fi],e=H('div','fc'),first=S.it.find(i=>i.f===fi);
   o.th??=first.cv.toDataURL?first.cv.toDataURL():'';e.style.borderTopColor=col(fi);e.draggable=true;
   e.innerHTML=`<span class="fn">${k+1}</span><img src="${o.th}" alt=""><b></b><small>${S.it.filter(i=>i.f===fi).length} pages</small>`;e.querySelector('b').textContent=o.name;
   const bar=H('div','fb');bar.append(bt('◀',()=>mv(k,k-1)),bt('▶',()=>mv(k,k+1)),bt('✕',()=>{S.it=S.it.filter(i=>i.f!==fi);ord=ord.filter(f=>f!==fi);draw();info()}));e.append(bar);
   e.ondragstart=()=>DF=k;e.ondragover=v=>v.preventDefault();e.ondrop=()=>{if(DF!=null)mv(DF,k);DF=null};return e}))}
 function mv(a,b){const act=ord.filter(f=>S.it.some(i=>i.f===f));if(b<0||b>=act.length)return;act.splice(b,0,act.splice(a,1)[0]);ord=act;S.it.sort((x,y)=>ord.indexOf(x.f)-ord.indexOf(y.f));draw()}
 // Step 2: apply the changes, show the result as pages, and keep editing it in the same panel.
 async function commit(){const k=$('#keep'),g=$('#go');k.disabled=g.disabled=true;
  try{say('Applying…');const bytes=await(await build(use())).save(),name=(S.f.length>1?'merged':base(S.f[0].name)+'-edited')+'.pdf';
   hist.push({f:S.f,it:S.it,ord});S.f=[];S.it=[];ord=[];await add([new File([bytes],name,{type:'application/pdf'})]);
   say(`Applied. This is now one ${S.it.length}-page document. Keep editing, or download it.`)}
  catch(e){say('Something went wrong: '+e.message)}k.disabled=false;info()}
 if(!img&&T.m!='view'){const k=$('#keep'),sel=$('#nxs');k.hidden=$('#nx').hidden=false;
  if(mode.drag)$('#go').textContent=T.id=='merge'?'Merge and download':'Download PDF';
  k.textContent=T.id=='merge'?'Merge and keep editing':'Apply and keep editing';k.onclick=commit;
  $('#undo').onclick=()=>{const h=hist.pop();if(!h)return;S.f=h.f;S.it=h.it;ord=h.ord;draw();info();say('Undid the last apply.')};
  TOOLS.filter(x=>!x.img&&x.id!==T.id).forEach(x=>sel.append(new Option(x.n,x.id)));
  sel.onchange=async()=>{const id=sel.value;if(!id)return;
   try{say('Preparing…');const b=await(await build(use())).save();handoff.file=new File([b],base(S.f[0].name)+'-edited.pdf',{type:'application/pdf'});history.pushState(null,'','/'+id);dispatchEvent(new PopStateEvent('popstate'))}
   catch(e){say('Something went wrong: '+e.message)}}}
 $('#pick').onclick=()=>$('#in').click();
 $('#in').onchange=e=>{add([...e.target.files]);e.target.value=''};
 document.ondragover=e=>e.preventDefault();
 document.ondrop=e=>{e.preventDefault();const f=[...e.dataTransfer.files];if(f.length&&(T.multi||!S.it.length))add(f)};
 if(handoff.file){const f=handoff.file;handoff.file=null;add([f])}
 $('#go').onclick=async()=>{const g=$('#go');g.disabled=1;
  try{say('Working…');const o=opts(),it=use(),out=T.run?await T.run(it,o):await(async()=>{const d=await build(it);if(T.post)await T.post(d,o);return[[T.id+'.pdf',await d.save(),'application/pdf']]})();
   for(const[n,d,t]of out)save(n,d,t);
   say(T.id=='compress'?`Done. ${kb(S.f.reduce((a,f)=>a+f.buf.byteLength,0))} became ${kb(out[0][1].length)}.`:'Done. Your download has started.')}
  catch(e){say('Something went wrong: '+e.message)}g.disabled=0};return()=>{document.ondrop=null;document.ondragover=null;S.f=[];S.it=[];root.innerHTML=''}}
