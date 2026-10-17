import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'page-numbers',n:'Add page numbers',i:'🔢',c:'edit',m:'view',b:'Add numbers',d:'Stamp “1 / 10” style numbers on every page.',
 o:[{k:'p',l:'Position',v:[['center','Bottom center'],['right','Bottom right'],['left','Bottom left']]}],
 post:async(d,o)=>{const f=await d.embedFont(PDFLib.StandardFonts.Helvetica),n=d.getPageCount();
  d.getPages().forEach((p,i)=>{const t=`${i+1} / ${n}`,w=f.widthOfTextAtSize(t,10),W=p.getWidth();
  p.drawText(t,{x:o.p=='left'?36:o.p=='right'?W-36-w:(W-w)/2,y:24,size:10,font:f})})}};
export default tool;
