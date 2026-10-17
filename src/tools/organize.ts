import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'organize',n:'Organize pages',i:'🗂',c:'org',m:'order',b:'Save PDF',d:'Reorder, rotate and delete pages with live previews.'};
export default tool;
