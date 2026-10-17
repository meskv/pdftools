import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'remove',n:'Remove pages',i:'🗑',c:'org',m:'mark',b:'Remove selected pages',d:'Click the pages you want to delete, then save.'};
export default tool;
