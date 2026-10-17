import type { Tool } from './types';
import { base } from '../engine/pdf';

const tool: Tool = {
  id: 'protect', n: 'Protect PDF', i: '🔒', c: 'sec', b: 'Protect PDF',
  d: 'Lock a PDF with a password using AES-256. The encryption happens on your device.',
  o: [{ k: 'u', l: 'Password', t: 'password' }, { k: 'c', l: 'Confirm password', t: 'password' }],
  q: async (bytes, o, name) => {
    if (!o.u) throw new Error('Enter a password.');
    if (o.u !== o.c) throw new Error('The passwords don’t match.');
    const { qpdf } = await import('../engine/qpdf');
    return [[base(name) + '-protected.pdf', await qpdf(bytes, ['--encrypt', o.u, o.u, '256', '--']), 'application/pdf']];
  },
};
export default tool;
