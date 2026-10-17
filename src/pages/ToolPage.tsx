import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuickTool from '../components/QuickTool';
import ToolGrid from '../components/ToolGrid';
import { TOOLS } from '../tools';
import { mountPageTool } from '../workspace/pageWorkspace';
import { mountEditor } from '../workspace/editor';

export default function ToolPage() {
  const { id } = useParams();
  const tool = TOOLS.find(t => t.id === id);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tool || tool.q || !host.current) return;
    document.title = `${tool.n} – PDF Tools`;
    return tool.ed ? mountEditor(tool, host.current) : mountPageTool(tool, host.current);
  }, [tool]);

  if (!tool) return <section className="head"><h1>Tool not found</h1><p><Link to="/">Browse all tools</Link></p></section>;
  return (
    <>
      {tool.q ? <QuickTool key={tool.id} tool={tool} /> : <div ref={host} />}
      <h2 className="more">More tools</h2>
      <ToolGrid tools={TOOLS.filter(t => t !== tool)} />
    </>
  );
}
