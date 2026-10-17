import * as PDFLib from 'pdf-lib';
import JSZip from 'jszip';
import { S, H, say, build, RENDER, BLOB } from '../engine/pdf';
import type { Tool } from './types';

const tool: Tool = {id:'redact',n:'Redact PDF',i:'⬛',c:'sec',ed:['redact'],b:'Redact and save',d:'Black out sensitive areas for good. Redacted pages are flattened, so the hidden text can’t be recovered.'};
export default tool;
