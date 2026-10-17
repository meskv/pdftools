import type { Tool } from './types';
import { base } from '../engine/pdf';

const tool: Tool = {
  id: 'unlock', n: 'Unlock PDF', i: '🔓', c: 'sec', b: 'Unlock PDF',
  d: 'Remove a password or editing restrictions. Leave the password empty for files that only restrict printing or copying.',
  o: [{ k: 'p', l: 'Password (if the file asks for one)', t: 'password' }],
  q: async (bytes, o, name) => {
    const { qpdf } = await import('../engine/qpdf');
    return [[base(name) + '-unlocked.pdf', await qpdf(bytes, [`--password=${o.p ?? ''}`, '--decrypt']), 'application/pdf']];
  },
};
export default tool;
