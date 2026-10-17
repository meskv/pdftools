import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'pdf-to-text',n:'PDF to text',i:'📝',c:'from',m:'view',b:'Extract text',d:'Pull the text out of a PDF. Scanned pages without a text layer come out empty.',
 run:async it=>{let t='';for(const i of it){const c=await(await S.f[0].pdf.getPage(i.p)).getTextContent();
  t+=`--- Page ${i.p} ---\n`+c.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('')+'\n\n'}
  return[['text.txt',t,'text/plain']]}};
export default tool;
