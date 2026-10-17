export interface Tool {
  id: string; n: string; i: string; c: string; d: string; b?: string;
  /** page-grid mode: order | img | rot | mark | keep | view */ m?: string;
  multi?: number; img?: number;
  /** click-to-place editor tools */ ed?: string[];
  o?: any[]; run?: (it: any[], o: any) => Promise<any[]>; post?: (d: any, o: any) => Promise<void>;
}
