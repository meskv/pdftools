import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'extract',n:'Extract pages',i:'📤',c:'org',m:'keep',b:'Extract selected pages',d:'Click the pages you want to keep as a new PDF.'};
export default tool;
