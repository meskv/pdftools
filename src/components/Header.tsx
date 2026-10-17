import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS, CATS } from '../tools';

const QUICK = ['merge', 'split', 'compress', 'edit', 'sign'];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('mousedown', away); addEventListener('keydown', esc);
    return () => { removeEventListener('mousedown', away); removeEventListener('keydown', esc); };
  }, []);

  const toggleTheme = () => {
    const t = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = t; localStorage.t = t; setDark(!dark);
  };

  return (
    <header ref={ref}>
      <Link className="logo" to="/">PDF Tools</Link>
      <nav className="top">
        {QUICK.map(id => { const t = TOOLS.find(x => x.id === id)!; return <Link key={id} to={'/' + id}>{t.n}</Link>; })}
        <button className={'all' + (open ? ' on' : '')} aria-expanded={open} onClick={() => setOpen(!open)}>All tools ▾</button>
      </nav>
      <button id="theme" aria-label="Switch light or dark mode" onClick={toggleTheme}>◐</button>
      {open && (
        <div className="mega">
          {Object.entries(CATS).map(([k, [name, color]]) => (
            <div key={k}>
              <h4>{name}</h4>
              {TOOLS.filter(t => t.c === k).map(t => <Link key={t.id} to={'/' + t.id}><i style={{ background: color }}>{t.i}</i>{t.n}</Link>)}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
