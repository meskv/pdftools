import { useState } from 'react';
import ToolGrid from '../components/ToolGrid';
import { TOOLS, CATS } from '../tools';

export default function Home() {
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const list = TOOLS.filter(t => (!cat || t.c === cat) && (t.n + t.d).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <section className="hero">
        <h1>Every PDF tool you need, right in your browser</h1>
        <p>Merge, split, organize, edit, sign and convert PDFs. Free, private, and nothing is ever uploaded.</p>
        <input type="search" placeholder="Search tools, for example “merge”" value={q} onChange={e => setQ(e.target.value)} />
      </section>
      <nav className="chips">
        {[['', 'All'], ...Object.entries(CATS).map(([k, v]) => [k, v[0]])].map(([k, n]) => (
          <button key={k} className={k === cat ? 'on' : ''} onClick={() => setCat(k)}>{n}</button>
        ))}
      </nav>
      <ToolGrid tools={list} />
    </>
  );
}
