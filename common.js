const $=s=>document.querySelector(s);
const say=m=>{$('#status').textContent=m};
function ranges(s,n){const r=[];for(const p of s.split(',')){const m=p.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
if(!m)throw Error('Enter pages like 1-3, 5, 8.');const a=+m[1],b=+(m[2]||m[1]);
if(a<1||b>n||a>b)throw Error('Pages must be between 1 and '+n+'.');for(let i=a;i<=b;i++)r.push(i-1);}return r}
async function pdfjsReady(){if(window._pj)return;
const b=await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js')).blob();
pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(b);window._pj=1}
function save(name,data,type){const a=document.createElement('a');a.href=URL.createObjectURL(data instanceof Blob?data:new Blob([data],{type}));
a.download=name;document.body.append(a);a.click();a.remove()}
function init(T){
const files=[],inp=$('#inp'),dz=$('#drop'),list=$('#list'),go=$('#go');
inp.accept=T.accept;inp.multiple=T.multiple;
const ok=f=>T.accept==='image/*'?f.type.startsWith('image/'):/pdf$/i.test(f.type)||/\.pdf$/i.test(f.name);
const render=()=>{list.innerHTML='';files.forEach((f,i)=>{const li=document.createElement('li');
li.innerHTML='<span class="n"></span><small>'+Math.max(1,Math.round(f.size/1024))+' KB</small>';
li.firstChild.textContent=f.name;
const b=(t,fn)=>{const x=document.createElement('button');x.textContent=t;x.onclick=fn;li.append(x)};
if(T.multiple){b('Up',()=>{if(i){[files[i-1],files[i]]=[files[i],files[i-1]];render()}});
b('Down',()=>{if(i<files.length-1){[files[i+1],files[i]]=[files[i],files[i+1]];render()}})}
b('Remove',()=>{files.splice(i,1);render()});list.append(li)});
go.disabled=!files.length};
const add=fl=>{const g=[...fl].filter(ok);if(!g.length){say('That file type isn’t supported here.');return}
say('');T.multiple?files.push(...g):files.splice(0,files.length,g[0]);render()};
inp.onchange=()=>{add(inp.files);inp.value=''};
dz.ondragover=e=>{e.preventDefault();dz.classList.add('over')};
dz.ondragleave=()=>dz.classList.remove('over');
dz.ondrop=e=>{e.preventDefault();dz.classList.remove('over');add(e.dataTransfer.files)};
dz.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click()}};
go.onclick=async()=>{go.disabled=true;say('Working…');
try{for(const[n,d,t]of await T.run(files))save(n,d,t);say('Done. Your download has started.')}
catch(e){say('Something went wrong: '+e.message)}go.disabled=!files.length};
render()}
