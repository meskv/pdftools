export interface Tool {
  id: string; n: string; i: string; c: string; d: string; b?: string;
  /** page-grid mode: order | img | rot | mark | keep | view */ m?: string;
  multi?: number; img?: number;
  /** click-to-place editor tools */ ed?: string[];
  /** quick tools: process the raw file without page previews */ q?: (bytes: Uint8Array, o: Record<string, string>, name: string) => Promise<[string, Uint8Array | string, string][]>;
  o?: any[]; run?: (it: any[], o: any) => Promise<any[]>; post?: (d: any, o: any) => Promise<void>;
}
