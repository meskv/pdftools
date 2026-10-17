import type { Tool } from './types';
import { base } from '../engine/pdf';

const tool: Tool = {
  id: 'optimize', n: 'Optimize PDF', i: '⚡', c: 'opt', b: 'Optimize PDF',
  d: 'Shrink the file without changing how it looks. Text stays selectable. Optionally prepare it for fast web viewing.',
  o: [{ k: 'w', l: 'Fast web view', v: [['', 'Off'], ['1', 'On']] }],
  q: async (bytes, o, name) => {
    const { qpdf } = await import('../engine/qpdf');
    const args = ['--object-streams=generate', '--compress-streams=y', '--recompress-flate', '--compression-level=9', ...(o.w ? ['--linearize'] : [])];
    return [[base(name) + '-optimized.pdf', await qpdf(bytes, args), 'application/pdf']];
  },
};
export default tool;
