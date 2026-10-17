import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'compress',n:'Compress PDF',i:'🗜',c:'opt',m:'view',b:'Compress PDF',d:'Shrinks scanned or image-heavy PDFs. Pages become images, so text is no longer selectable.',
 o:[{k:'l',l:'Quality',v:[['1.5,.75','Balanced'],['1.2,.6','Smallest file'],['2,.85','Best quality']]}],
 run:async(it,o)=>{const d=await PDFLib.PDFDocument.create(),pdf=S.f[0].pdf,[s,q]=o.l.split(',');
  for(const[k,i]of it.entries()){say(`Compressing page ${k+1} of ${it.length}…`);const c=await RENDER(pdf,i.p,+s),a=(await pdf.getPage(i.p)).getViewport({scale:1});
  const j=await d.embedJpg(await(await BLOB(c,'image/jpeg',+q)).arrayBuffer());d.addPage([a.width,a.height]).drawImage(j,{x:0,y:0,width:a.width,height:a.height})}
  return[['compressed.pdf',await d.save(),'application/pdf']]}};
export default tool;
