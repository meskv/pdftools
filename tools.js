// To add a tool: add an entry here, then copy _template.html to <id>.html with data-tool="<id>".
const CATS={org:['Organize','#fde4df'],opt:['Optimize','#dcf3e2'],to:['Convert to PDF','#fff0c2'],from:['Convert from PDF','#dbe6fb'],edit:['Edit','#eadcf7']};
const M={order:{drag:1,del:1,rot:1},img:{drag:1,del:1},rot:{rot:1},mark:{pick:1},keep:{pick:1},view:{}};
const RENDER=async(pdf,p,s)=>{const pg=await pdf.getPage(p),v=pg.getViewport({scale:s}),c=H('canvas');c.width=v.width;c.height=v.height;await pg.render({canvasContext:c.getContext('2d'),viewport:v}).promise;return c};
const BLOB=(c,t,q)=>new Promise(r=>c.toBlob(r,t,q));
const TOOLS=[
{id:'merge',n:'Merge PDF',i:'➕',c:'org',m:'order',multi:1,b:'Merge PDF',d:'Combine PDFs and drag pages into the order you want.'},
{id:'organize',n:'Organize pages',i:'🗂',c:'org',m:'order',b:'Save PDF',d:'Reorder, rotate and delete pages with live previews.'},
{id:'remove',n:'Remove pages',i:'🗑',c:'org',m:'mark',b:'Remove selected pages',d:'Click the pages you want to delete, then save.'},
{id:'extract',n:'Extract pages',i:'📤',c:'org',m:'keep',b:'Extract selected pages',d:'Click the pages you want to keep as a new PDF.'},
{id:'split',n:'Split PDF',i:'✂️',c:'org',m:'view',b:'Split PDF',d:'Cut a PDF into separate files by range, or one file per page.',
 o:[{k:'r',l:'Ranges (blank = every page)',p:'1-3, 4-6, 9'}],
 run:async(it,o)=>{const z=new JSZip(),g=o.r.trim()?o.r.split(','):it.map((_,i)=>String(i+1));
  for(const[k,s]of g.entries()){const m=s.trim().match(/^(\d+)(?:-(\d+))?$/);if(!m)throw Error('Use ranges like 1-3, 5');const a=+m[1],b=+(m[2]||a);
  if(a<1||b>it.length||a>b)throw Error('Pages must be between 1 and '+it.length);z.file(`part-${k+1}.pdf`,await(await build(it.slice(a-1,b))).save())}
  return[['split.zip',await z.generateAsync({type:'blob'}),'application/zip']]}},
{id:'rotate',n:'Rotate pages',i:'🔄',c:'edit',m:'rot',b:'Save rotated PDF',d:'Turn single pages, or the whole document, in one click.'},
{id:'page-numbers',n:'Add page numbers',i:'🔢',c:'edit',m:'view',b:'Add numbers',d:'Stamp “1 / 10” style numbers on every page.',
 o:[{k:'p',l:'Position',v:[['center','Bottom center'],['right','Bottom right'],['left','Bottom left']]}],
 post:async(d,o)=>{const f=await d.embedFont(PDFLib.StandardFonts.Helvetica),n=d.getPageCount();
  d.getPages().forEach((p,i)=>{const t=`${i+1} / ${n}`,w=f.widthOfTextAtSize(t,10),W=p.getWidth();
  p.drawText(t,{x:o.p=='left'?36:o.p=='right'?W-36-w:(W-w)/2,y:24,size:10,font:f})})}},
{id:'watermark',n:'Add watermark',i:'💧',c:'edit',m:'view',b:'Add watermark',d:'Place diagonal text across every page.',
 o:[{k:'t',l:'Watermark text',d:'CONFIDENTIAL'},{k:'a',l:'Strength',v:[['.15','Light'],['.3','Medium'],['.5','Strong']]}],
 post:async(d,o)=>{if(!o.t.trim())throw Error('Enter the watermark text.');const f=await d.embedFont(PDFLib.StandardFonts.HelveticaBold);
  d.getPages().forEach(p=>{const{width:W,height:h}=p.getSize(),s=Math.min(110,W*1.1/(.6*o.t.length)),w=f.widthOfTextAtSize(o.t,s);
  p.drawText(o.t,{x:W/2-w*.3535,y:h/2-w*.3535,size:s,font:f,rotate:PDFLib.degrees(45),color:PDFLib.rgb(.5,.5,.5),opacity:+o.a})})}},
{id:'compress',n:'Compress PDF',i:'🗜',c:'opt',m:'view',b:'Compress PDF',d:'Shrinks scanned or image-heavy PDFs. Pages become images, so text is no longer selectable.',
 o:[{k:'l',l:'Quality',v:[['1.5,.75','Balanced'],['1.2,.6','Smallest file'],['2,.85','Best quality']]}],
 run:async(it,o)=>{const d=await PDFLib.PDFDocument.create(),pdf=S.f[0].pdf,[s,q]=o.l.split(',');
  for(const[k,i]of it.entries()){say(`Compressing page ${k+1} of ${it.length}…`);const c=await RENDER(pdf,i.p,+s),a=(await pdf.getPage(i.p)).getViewport({scale:1});
  const j=await d.embedJpg(await(await BLOB(c,'image/jpeg',+q)).arrayBuffer());d.addPage([a.width,a.height]).drawImage(j,{x:0,y:0,width:a.width,height:a.height})}
  return[['compressed.pdf',await d.save(),'application/pdf']]}},
{id:'images-to-pdf',n:'Images to PDF',i:'🖼',c:'to',m:'img',img:1,multi:1,b:'Create PDF',d:'Turn JPG, PNG or WebP images into a PDF. Drag to reorder.',
 run:async it=>{const d=await PDFLib.PDFDocument.create();
  for(const i of it){const f=S.f[i.f].file;let m;
  if(f.type=='image/jpeg')m=await d.embedJpg(await f.arrayBuffer());else if(f.type=='image/png')m=await d.embedPng(await f.arrayBuffer());
  else{const b=await createImageBitmap(f),c=H('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);m=await d.embedPng(await(await BLOB(c)).arrayBuffer())}
  d.addPage([m.width,m.height]).drawImage(m,{x:0,y:0,width:m.width,height:m.height})}
  return[['images.pdf',await d.save(),'application/pdf']]}},
{id:'pdf-to-images',n:'PDF to images',i:'📷',c:'from',m:'view',b:'Convert to images',d:'Save every page as a PNG or JPG in one ZIP file.',
 o:[{k:'f',l:'Format',v:[['png','PNG'],['jpeg','JPG']]},{k:'s',l:'Quality',v:[['1.5','Standard'],['2','High'],['3','Very high']]}],
 run:async(it,o)=>{const z=new JSZip();
  for(const[k,i]of it.entries()){say(`Page ${k+1} of ${it.length}…`);z.file(`page-${i.p}.${o.f=='jpeg'?'jpg':'png'}`,await BLOB(await RENDER(S.f[0].pdf,i.p,+o.s),'image/'+o.f,.92))}
  return[['pages.zip',await z.generateAsync({type:'blob'}),'application/zip']]}},
{id:'pdf-to-text',n:'PDF to text',i:'📝',c:'from',m:'view',b:'Extract text',d:'Pull the text out of a PDF. Scanned pages without a text layer come out empty.',
 run:async it=>{let t='';for(const i of it){const c=await(await S.f[0].pdf.getPage(i.p)).getTextContent();
  t+=`--- Page ${i.p} ---\n`+c.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('')+'\n\n'}
  return[['text.txt',t,'text/plain']]}}
];
