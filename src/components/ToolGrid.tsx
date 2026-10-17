import { Link } from 'react-router-dom';
import { CATS } from '../tools';
import type { Tool } from '../tools/types';

export default function ToolGrid({ tools }: { tools: Tool[] }) {
  if (!tools.length) return <p>No tools match your search.</p>;
  return (
    <div className="tools">
      {tools.map(t => (
        <Link key={t.id} className="tool" to={'/' + t.id}>
          <i style={{ background: CATS[t.c][1] }}>{t.i}</i><b>{t.n}</b><span>{t.d}</span>
        </Link>
      ))}
    </div>
  );
}
