import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'split',n:'Split PDF',i:'✂️',c:'org',m:'view',b:'Split PDF',d:'Cut a PDF into separate files by range, or one file per page.',
 o:[{k:'r',l:'Ranges (blank = every page)',p:'1-3, 4-6, 9'}],
 run:async(it,o)=>{const z=new JSZip(),g=o.r.trim()?o.r.split(','):it.map((_,i)=>String(i+1));
  for(const[k,s]of g.entries()){const m=s.trim().match(/^(\d+)(?:-(\d+))?$/);if(!m)throw Error('Use ranges like 1-3, 5');const a=+m[1],b=+(m[2]||a);
  if(a<1||b>it.length||a>b)throw Error('Pages must be between 1 and '+it.length);z.file(`part-${k+1}.pdf`,await(await build(it.slice(a-1,b))).save())}
  return[['split.zip',await z.generateAsync({type:'blob'}),'application/zip']]}};
export default tool;
