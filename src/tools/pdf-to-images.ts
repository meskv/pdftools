import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'pdf-to-images',n:'PDF to images',i:'📷',c:'from',m:'view',b:'Convert to images',d:'Save every page as a PNG or JPG in one ZIP file.',
 o:[{k:'f',l:'Format',v:[['png','PNG'],['jpeg','JPG']]},{k:'s',l:'Quality',v:[['1.5','Standard'],['2','High'],['3','Very high']]}],
 run:async(it,o)=>{const z=new JSZip();
  for(const[k,i]of it.entries()){say(`Page ${k+1} of ${it.length}…`);z.file(`page-${i.p}.${o.f=='jpeg'?'jpg':'png'}`,await BLOB(await RENDER(S.f[0].pdf,i.p,+o.s),'image/'+o.f,.92))}
  return[['pages.zip',await z.generateAsync({type:'blob'}),'application/zip']]}};
export default tool;
