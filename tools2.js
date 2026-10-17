CATS.sec=['Security & signing','#d8f1ef'];
const TESS='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
TOOLS.push(
{id:'edit',n:'Edit PDF',i:'✏️',c:'edit',ed:['text','box','img'],b:'Save edited PDF',d:'Add text, images, highlights and whiteout directly on the page. Text supports Latin characters.'},
{id:'sign',n:'Sign PDF',i:'🖊',c:'sec',ed:['sign','text','img'],b:'Save signed PDF',d:'Draw your signature, or place a signature image, and position it on the page.'},
{id:'redact',n:'Redact PDF',i:'⬛',c:'sec',ed:['redact'],b:'Redact and save',d:'Black out sensitive areas for good. Redacted pages are flattened, so the hidden text can’t be recovered.'},
{id:'crop',n:'Crop PDF',i:'✂',c:'edit',ed:['crop'],b:'Crop and save',d:'Draw a crop area on any page. Pages without one stay as they are.'},
{id:'ocr',n:'OCR PDF',i:'🔍',c:'opt',m:'view',b:'Run OCR',d:'Recognize text in scanned PDFs and make them searchable. Hindi and English supported.',
 o:[{k:'l',l:'Language',v:[['eng','English'],['hin','Hindi'],['eng+hin','English + Hindi']]},{k:'f',l:'Output',v:[['pdf','Searchable PDF'],['txt','Text file']]}],
 run:async(it,o)=>{await load(TESS);const w=await Tesseract.createWorker(o.l),out=await PDFLib.PDFDocument.create();let txt='';
  for(const[k,i]of it.entries()){say(`Reading page ${k+1} of ${it.length}. The first page is slow while the language downloads…`);
   const{data}=await w.recognize(await RENDER(S.f[0].pdf,i.p,2.2),{},{pdf:true});txt+=`--- Page ${i.p} ---\n${data.text}\n\n`;
   const[p]=await out.copyPages(await PDFLib.PDFDocument.load(new Uint8Array(data.pdf)),[0]),a=(await S.f[0].pdf.getPage(i.p)).getViewport({scale:1}).width/p.getWidth();p.scale(a,a);out.addPage(p)}
  await w.terminate();return o.f=='txt'?[['ocr.txt',txt,'text/plain']]:[['searchable.pdf',await out.save(),'application/pdf']]}},
{id:'metadata',n:'Edit metadata',i:'🏷',c:'edit',m:'view',b:'Save PDF',d:'Set or clear the title, author and keywords. The original metadata is removed.',
 o:[{k:'t',l:'Title'},{k:'a',l:'Author'},{k:'s',l:'Subject'},{k:'k',l:'Keywords (comma separated)'}],
 post:async(d,o)=>{d.setTitle(o.t);d.setAuthor(o.a);d.setSubject(o.s);d.setKeywords(o.k.split(',').map(x=>x.trim()).filter(Boolean));d.setProducer('');d.setCreator('')}},
{id:'flatten',n:'Flatten PDF',i:'📎',c:'opt',m:'view',b:'Flatten PDF',d:'Turn fillable form fields into plain, non-editable content.',
 run:async()=>{const d=await PDFLib.PDFDocument.load(S.f[0].buf,{ignoreEncryption:true});d.getForm().flatten();return[['flattened.pdf',await d.save(),'application/pdf']]}}
);
