import type { Request } from 'express';

// Keep the base Request type optional for non-authenticated routes
declare module 'express' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}
