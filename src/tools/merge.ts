import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'merge',n:'Merge PDF',i:'➕',c:'org',m:'order',multi:1,b:'Merge PDF',d:'Combine PDFs and drag pages into the order you want.'};
export default tool;
