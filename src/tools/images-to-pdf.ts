import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'images-to-pdf',n:'Images to PDF',i:'🖼',c:'to',m:'img',img:1,multi:1,b:'Create PDF',d:'Turn JPG, PNG or WebP images into a PDF. Drag to reorder.',
 run:async it=>{const d=await PDFLib.PDFDocument.create();
  for(const i of it){const f=S.f[i.f].file;let m;
  if(f.type=='image/jpeg')m=await d.embedJpg(await f.arrayBuffer());else if(f.type=='image/png')m=await d.embedPng(await f.arrayBuffer());
  else{const b=await createImageBitmap(f),c=H('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);m=await d.embedPng(await(await BLOB(c)).arrayBuffer())}
  d.addPage([m.width,m.height]).drawImage(m,{x:0,y:0,width:m.width,height:m.height})}
  return[['images.pdf',await d.save(),'application/pdf']]}};
export default tool;
