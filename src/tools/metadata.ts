import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'metadata',n:'Edit metadata',i:'🏷',c:'edit',m:'view',b:'Save PDF',d:'Set or clear the title, author and keywords. The original metadata is removed.',
 o:[{k:'t',l:'Title'},{k:'a',l:'Author'},{k:'s',l:'Subject'},{k:'k',l:'Keywords (comma separated)'}],
 post:async(d,o)=>{d.setTitle(o.t);d.setAuthor(o.a);d.setSubject(o.s);d.setKeywords(o.k.split(',').map(x=>x.trim()).filter(Boolean));d.setProducer('');d.setCreator('')}};
export default tool;
