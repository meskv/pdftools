import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'flatten',n:'Flatten PDF',i:'📎',c:'opt',m:'view',b:'Flatten PDF',d:'Turn fillable form fields into plain, non-editable content.',
 run:async()=>{const d=await PDFLib.PDFDocument.load(S.f[0].buf,{ignoreEncryption:true});d.getForm().flatten();return[['flattened.pdf',await d.save(),'application/pdf']]}};
export default tool;
