import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'ocr',n:'OCR PDF',i:'🔍',c:'opt',m:'view',b:'Run OCR',d:'Recognize text in scanned PDFs and make them searchable. Hindi and English supported.',
 o:[{k:'l',l:'Language',v:[['eng','English'],['hin','Hindi'],['eng+hin','English + Hindi']]},{k:'f',l:'Output',v:[['pdf','Searchable PDF'],['txt','Text file']]}],
 run:async(it,o)=>{const Tesseract:any=await import('tesseract.js');const w=await (Tesseract.default??Tesseract).createWorker(o.l),out=await PDFLib.PDFDocument.create();let txt='';
  for(const[k,i]of it.entries()){say(`Reading page ${k+1} of ${it.length}. The first page is slow while the language downloads…`);
   const{data}=await w.recognize(await RENDER(S.f[0].pdf,i.p,2.2),{},{pdf:true});txt+=`--- Page ${i.p} ---\n${data.text}\n\n`;
   const[p]=await out.copyPages(await PDFLib.PDFDocument.load(new Uint8Array(data.pdf)),[0]),a=(await S.f[0].pdf.getPage(i.p)).getViewport({scale:1}).width/p.getWidth();p.scale(a,a);out.addPage(p)}
  await w.terminate();return o.f=='txt'?[['ocr.txt',txt,'text/plain']]:[['searchable.pdf',await out.save(),'application/pdf']]}};
export default tool;
