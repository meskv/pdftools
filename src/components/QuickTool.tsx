import { useRef, useState } from 'react';
import type { Tool } from '../tools/types';
import { save } from '../engine/pdf';

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;

/** One file in, options, one button. For tools that don't need page previews (and can open locked PDFs). */
export default function QuickTool({ tool }: { tool: Tool }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [o, setO] = useState<Record<string, string>>(() => Object.fromEntries((tool.o ?? []).map(f => [f.k, f.d ?? f.v?.[0][0] ?? ''])));
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const pick = (f?: File) => { if (f && /\.pdf$/i.test(f.name)) { setFile(f); setMsg(''); } else setMsg('Please choose a PDF file.'); };
  const run = async () => {
    if (!file) return;
    setBusy(true); setMsg('Working…');
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const out = await tool.q!(bytes, o, file.name);
      out.forEach(([n, d, t]) => save(n, d, t));
      setMsg(`Done. ${kb(bytes.length)} became ${kb((out[0][1] as Uint8Array).length)}. Your download has started.`);
    } catch (e) { setMsg('Something went wrong: ' + (e as Error).message); }
    setBusy(false);
  };

  return (
    <>
      <section className="head"><h1>{tool.n}</h1><p>{tool.d}</p></section>
      <div className="dz" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}>
        <div className="big">{tool.i}</div>
        <h2>{file ? file.name : 'Drop a PDF here'}</h2>
        <button className="btn" onClick={() => input.current?.click()}>{file ? 'Choose a different PDF' : 'Select a PDF'}</button>
        <p>{file ? kb(file.size) : 'Processed on your device. Nothing is uploaded.'}</p>
        <input ref={input} type="file" hidden accept="application/pdf" onChange={e => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      {file && (
        <div className="qp">
          {(tool.o ?? []).map(f => (
            <label key={f.k}>{f.l}
              {f.v
                ? <select value={o[f.k]} onChange={e => setO({ ...o, [f.k]: e.target.value })}>{f.v.map(([a, b]: string[]) => <option key={a} value={a}>{b}</option>)}</select>
                : <input type={f.t ?? 'text'} value={o[f.k]} onChange={e => setO({ ...o, [f.k]: e.target.value })} autoComplete="off" />}
            </label>
          ))}
          <button className="btn" disabled={busy} onClick={run}>{tool.b ?? tool.n}</button>
        </div>
      )}
      <p className="qmsg" role="status">{msg}</p>
    </>
  );
}
