import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'crop',n:'Crop PDF',i:'✂',c:'edit',ed:['crop'],b:'Crop and save',d:'Draw a crop area on any page. Pages without one stay as they are.'};
export default tool;
