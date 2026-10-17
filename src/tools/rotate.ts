import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'rotate',n:'Rotate pages',i:'🔄',c:'edit',m:'rot',b:'Save rotated PDF',d:'Turn single pages, or the whole document, in one click.'};
export default tool;
