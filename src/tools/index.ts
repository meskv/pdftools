import type { Tool } from './types';
import t_merge from './merge';
import t_organize from './organize';
import t_remove from './remove';
import t_extract from './extract';
import t_split from './split';
import t_rotate from './rotate';
import t_page_numbers from './page-numbers';
import t_watermark from './watermark';
import t_compress from './compress';
import t_images_to_pdf from './images-to-pdf';
import t_pdf_to_images from './pdf-to-images';
import t_pdf_to_text from './pdf-to-text';
import t_edit from './edit';
import t_sign from './sign';
import t_redact from './redact';
import t_crop from './crop';
import t_ocr from './ocr';
import t_metadata from './metadata';
import t_flatten from './flatten';
import t_protect from './protect';
import t_unlock from './unlock';
import t_repair from './repair';
import t_optimize from './optimize';
export { CATS } from './categories';
export const TOOLS: Tool[] = [
  t_merge,
  t_organize,
  t_remove,
  t_extract,
  t_split,
  t_rotate,
  t_page_numbers,
  t_watermark,
  t_compress,
  t_images_to_pdf,
  t_pdf_to_images,
  t_pdf_to_text,
  t_edit,
  t_sign,
  t_redact,
  t_crop,
  t_ocr,
  t_metadata,
  t_flatten,
  t_protect,
  t_unlock,
  t_repair,
  t_optimize
];
