import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'edit',n:'Edit PDF',i:'✏️',c:'edit',ed:['text','box','img'],b:'Save edited PDF',d:'Add text, images, highlights and whiteout directly on the page. Text supports Latin characters.'};
export default tool;
