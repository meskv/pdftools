import * as PDFLib from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
export { PDFLib, pdfjsLib };
export const $ = (s: string): any => document.querySelector(s);
export const H = (t: string, c?: string, h?: string): any => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
/** Shared state of the file(s) and pages currently open in a workspace. */
export const S: { f: any[]; it: any[] } = { f: [], it: [] };
export const say = (m: string) => { const e = $('#st'); if (e) e.textContent = m; };
export const ready = async () => {};
export const save = (n: string, d: any, t: string) => { const a = H('a'); a.href = URL.createObjectURL(d instanceof Blob ? d : new Blob([d], { type: t })); a.download = n; document.body.append(a); a.click(); a.remove(); };
export const BLOB = (c: any, t?: string, q?: number): Promise<Blob> => new Promise(r => c.toBlob(r, t, q));
export const RENDER = async (pdf: any, p: number, s: number): Promise<any> => { const pg = await pdf.getPage(p), v = pg.getViewport({ scale: s }), c = H('canvas'); c.width = v.width; c.height = v.height; await pg.render({ canvasContext: c.getContext('2d'), viewport: v }).promise; return c; };
/** Build a new PDF from page items ({f: file index, p: page number, r: rotation}). */
export async function build(it: any[]) {
  const d = await PDFLib.PDFDocument.create();
  for (const i of it) { const f = S.f[i.f]; f.doc ??= await PDFLib.PDFDocument.load(f.buf, { ignoreEncryption: true });
    const [p] = await d.copyPages(f.doc, [i.p - 1]); if (i.r) p.setRotation(PDFLib.degrees((p.getRotation().angle + i.r) % 360)); d.addPage(p); }
  return d;
}
