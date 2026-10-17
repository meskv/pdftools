import createModule from '@neslinesli93/qpdf-wasm';
import wasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';

/** Run qpdf (WebAssembly) on a PDF in memory: encrypt, decrypt, repair, optimize. */
export async function qpdf(bytes: Uint8Array, args: string[]): Promise<Uint8Array> {
  const m: any = await (createModule as any)({ locateFile: () => wasmUrl });
  m.FS.writeFile('/in.pdf', bytes);
  let status = 0;
  try { status = m.callMain([...args, '/in.pdf', '/out.pdf']); } catch (e: any) { status = e?.status ?? 1; }
  try { return m.FS.readFile('/out.pdf'); }
  catch { throw new Error(status === 2 ? 'Wrong password, or this file can’t be opened.' : 'The PDF engine couldn’t process this file.'); }
}
