export type ResponseType = 'json' | 'file' | 'stream';

export interface ResponseLocals {
  data?: unknown;
  status?: number;
}

// Extend Express Response.locals
declare module 'express-serve-static-core' {
  interface Locals extends ResponseLocals {}
}
