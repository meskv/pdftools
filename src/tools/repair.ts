import type { Tool } from './types';
import { base } from '../engine/pdf';

const tool: Tool = {
  id: 'repair', n: 'Repair PDF', i: '🩹', c: 'opt', b: 'Repair PDF',
  d: 'Rebuild a damaged PDF’s structure so it opens again. Works for many broken or truncated files.',
  q: async (bytes, _o, name) => {
    const { qpdf } = await import('../engine/qpdf');
    return [[base(name) + '-repaired.pdf', await qpdf(bytes, []), 'application/pdf']];
  },
};
export default tool;
