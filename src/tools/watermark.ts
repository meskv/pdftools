import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'watermark',n:'Add watermark',i:'💧',c:'edit',m:'view',b:'Add watermark',d:'Place diagonal text across every page.',
 o:[{k:'t',l:'Watermark text',d:'CONFIDENTIAL'},{k:'a',l:'Strength',v:[['.15','Light'],['.3','Medium'],['.5','Strong']]}],
 post:async(d,o)=>{if(!o.t.trim())throw Error('Enter the watermark text.');const f=await d.embedFont(PDFLib.StandardFonts.HelveticaBold);
  d.getPages().forEach(p=>{const{width:W,height:h}=p.getSize(),s=Math.min(110,W*1.1/(.6*o.t.length)),w=f.widthOfTextAtSize(o.t,s);
  p.drawText(o.t,{x:W/2-w*.3535,y:h/2-w*.3535,size:s,font:f,rotate:PDFLib.degrees(45),color:PDFLib.rgb(.5,.5,.5),opacity:+o.a})})}};
export default tool;
