import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'sign',n:'Sign PDF',i:'🖊',c:'sec',ed:['sign','text','img'],b:'Save signed PDF',d:'Draw your signature, or place a signature image, and position it on the page.'};
export default tool;
