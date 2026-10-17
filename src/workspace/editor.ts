// @ts-nocheck
// Imperative DOM module (drag-and-drop pages / click-to-place objects), mounted from a React page.
import { $, H, S, say, ready, save, build, RENDER, BLOB, PDFLib, pdfjsLib } from '../engine/pdf';
import { M } from '../tools/modes';

const K={whiteout:['#ffffff',1],highlight:['#ffe14d',.45],redact:['#000000',1]};
const LB={text:'Add text',box:'Add box',img:'Add image',sign:'Draw signature',redact:'Add redaction box',crop:'Set crop area'};
const rgb=h=>{const n=parseInt(h.slice(1),16);return PDFLib.rgb((n>>16)/255,((n>>8)&255)/255,(n&255)/255)};
function pad(done){
 const m=H('div','modal',`<div class="mb"><h3>Draw your signature</h3><canvas width="480" height="180"></canvas><p><button class="btn" id="su">Use signature</button> <button id="sc">Clear</button> <button id="sx">Cancel</button></p></div>`);
 document.body.append(m);const c=m.querySelector('canvas'),x=c.getContext('2d');let d=0;x.lineWidth=3;x.lineCap='round';x.strokeStyle='#111';
 const pt=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};
 c.onpointerdown=e=>{d=1;c.setPointerCapture(e.pointerId);x.beginPath();x.moveTo(...pt(e))};
 c.onpointermove=e=>{if(d){x.lineTo(...pt(e));x.stroke()}};c.onpointerup=()=>d=0;
 m.querySelector('#sc').onclick=()=>x.clearRect(0,0,c.width,c.height);
 m.querySelector('#sx').onclick=()=>m.remove();
 m.querySelector('#su').onclick=()=>{done(c.toDataURL('image/png'));m.remove()}}
export function mountEditor(T:any,root:HTMLElement){
 document.title=T.n+' – PDF Tools';let tool=T.ed[0],pend=null;const P=[];
 root.innerHTML=`<section class="head"><h1>${T.n}</h1><p>${T.d}</p></section>
 <div id="dz" class="dz"><div class="big">${T.i}</div><h2>Drop a PDF here</h2><button class="btn" id="pick">Select a PDF</button><p>Processed on your device. Nothing is uploaded.</p><input id="in" type="file" hidden accept="application/pdf"><input id="fi" type="file" hidden accept="image/*"></div>
 <div id="ws" hidden><div id="pages"></div><aside><h3>${T.n}</h3><div id="tb"></div><div id="ops" style="display:contents"></div><p id="info">Choose a tool, then click on a page to place it.</p><button class="btn go" id="go">${T.b}</button><p id="st" role="status"></p></aside></div>`;
 const sel=(id,l,o)=>`<label>${l}<select id="${id}">${o}</select></label>`;
 $('#ops').innerHTML=(T.ed.includes('text')?sel('o_c','Text color','<option value="#000000">Black</option><option value="#1d4ed8">Blue</option><option value="#dc2626">Red</option>')+sel('o_s','Text size','<option>14</option><option selected>18</option><option>24</option><option>36</option>'):'')+(T.ed.includes('box')?sel('o_k','Box style','<option value="whiteout">Whiteout</option><option value="highlight">Highlight</option><option value="redact">Black box</option>'):'');
 const tb=$('#tb');
 T.ed.forEach(t=>{const b=H('button','',LB[t]);b.onclick=()=>{tool=t;[...tb.children].forEach(x=>x.classList.toggle('on',x===b));
  if(t=='sign')pad(s=>{pend=s;say('Now click on the page where the signature should go.')});else if(t=='img')$('#fi').click();else say('Click on a page to place it.')};tb.append(b)});
 tb.firstChild.classList.add('on');
 function place(pg,e){
  const r=pg.wrap.getBoundingClientRect(),o=H('div','ob '+tool),ob={t:tool=='sign'?'img':tool,el:o};let c;
  if(tool=='text'){c=ob.c=H('div','tx','Text');c.contentEditable=true;ob.col=$('#o_c').value;c.style.color=ob.col;c.style.fontSize=$('#o_s').value+'px'}
  else if(ob.t=='img'){if(!pend)return say(tool=='sign'?'Draw your signature first.':'Choose an image first.');c=new Image();c.src=ob.src=pend;o.style.width='160px';c.onload=()=>o.style.height=160*c.naturalHeight/c.naturalWidth+'px';pend=null}
  else{ob.k=tool=='box'?$('#o_k').value:'redact';o.dataset.k=tool=='crop'?'crop':ob.k;o.style.width='160px';o.style.height='40px';
   if(tool=='crop'){pg.obs.filter(b=>b.t=='crop').forEach(b=>b.el.remove());pg.obs=pg.obs.filter(b=>b.t!='crop')}}
  o.style.left=e.clientX-r.left+'px';o.style.top=e.clientY-r.top+'px';
  const hd=H('b','hd','✥'),dl=H('b','dl','✕');if(c)o.append(c);o.append(hd,dl);
  dl.onclick=()=>{o.remove();pg.obs.splice(pg.obs.indexOf(ob),1)};
  hd.onpointerdown=v=>{v.preventDefault();const sx=v.clientX-o.offsetLeft,sy=v.clientY-o.offsetTop,mv=w=>{o.style.left=Math.max(0,w.clientX-sx)+'px';o.style.top=Math.max(0,w.clientY-sy)+'px'},up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
  pg.obs.push(ob);pg.wrap.append(o);if(tool=='text'){c.focus();getSelection().selectAllChildren(c)}}
 async function open(file){
  await ready();const o=S.f[0]={name:file.name,buf:await file.arrayBuffer()};
  try{o.pdf=await pdfjsLib.getDocument({data:new Uint8Array(o.buf.slice(0))}).promise}catch(e){$('#dz').hidden=0;return alert('Couldn’t read this PDF. It may be password-protected or damaged.')}
  $('#dz').hidden=1;$('#ws').hidden=0;
  for(let p=1;p<=o.pdf.numPages;p++){say(`Loading page ${p} of ${o.pdf.numPages}…`);const w=H('div','ep');w.append(await RENDER(o.pdf,p,1.3));$('#pages').append(w);
   const pg={wrap:w,obs:[]};P.push(pg);w.onclick=e=>{if(!e.target.closest('.ob'))place(pg,e)}}
  say('')}
 $('#pick').onclick=()=>$('#in').click();$('#in').onchange=e=>{open(e.target.files[0]);e.target.value=''};
 $('#fi').onchange=async e=>{const b=await createImageBitmap(e.target.files[0]),c=H('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);pend=c.toDataURL('image/png');e.target.value='';say('Now click on the page where the image should go.')};
 document.ondragover=e=>e.preventDefault();document.ondrop=e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&!S.f.length)open(f)};
 $('#go').onclick=async()=>{const g=$('#go');g.disabled=1;
  try{say('Saving…');const f=S.f[0],src=await PDFLib.PDFDocument.load(f.buf,{ignoreEncryption:true});let d=src;
   if(T.ed.includes('redact')){d=await PDFLib.PDFDocument.create();
    for(const[i,pg]of P.entries()){if(!pg.obs.length){const[p]=await d.copyPages(src,[i]);d.addPage(p);continue}
     say(`Flattening page ${i+1}…`);const c=await RENDER(f.pdf,i+1,2),k=c.width/pg.wrap.clientWidth,x=c.getContext('2d');x.fillStyle='#000';
     pg.obs.forEach(b=>x.fillRect(b.el.offsetLeft*k,b.el.offsetTop*k,b.el.offsetWidth*k,b.el.offsetHeight*k));
     const j=await d.embedJpg(await(await BLOB(c,'image/jpeg',.92)).arrayBuffer()),a=(await f.pdf.getPage(i+1)).getViewport({scale:1});
     d.addPage([a.width,a.height]).drawImage(j,{x:0,y:0,width:a.width,height:a.height})}}
   else{const font=await d.embedFont(PDFLib.StandardFonts.Helvetica);
    for(const[i,pg]of P.entries()){const p=d.getPage(i),W=p.getWidth(),Hh=p.getHeight(),k=W/pg.wrap.clientWidth;
     for(const b of pg.obs){const e=b.el,x=e.offsetLeft*k,w=e.offsetWidth*k,h=e.offsetHeight*k,y=Hh-e.offsetTop*k-h;
      if(b.t=='text'){const sz=parseFloat(b.c.style.fontSize)*k;b.c.innerText.split('\n').forEach((ln,j)=>p.drawText(ln,{x:x+2*k,y:Hh-e.offsetTop*k-sz*(1.05+1.2*j),size:sz,font,color:rgb(b.col)}))}
      else if(b.t=='box'){const[cl,op]=K[b.k];p.drawRectangle({x,y,width:w,height:h,color:rgb(cl),opacity:op})}
      else if(b.t=='img')p.drawImage(await d.embedPng(b.src),{x,y,width:w,height:h});
      else if(b.t=='crop')p.setCropBox(x,y,w,h)}}}
   save(T.id+'.pdf',await d.save(),'application/pdf');say('Done. Your download has started.')}
  catch(e){say('Something went wrong: '+e.message)}g.disabled=0};return()=>{document.ondrop=null;document.ondragover=null;S.f=[];S.it=[];root.innerHTML=''}}
