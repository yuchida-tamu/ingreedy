import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware to handle HTTP responses consistently.
 * Looks for data in res.locals.data and status in res.locals.status.
 * If no status is provided, defaults to 200 for success responses.
 */
export const httpResponseHandler = (_: Request, res: Response, next: NextFunction): void => {
  // If there's no data in res.locals, pass to next middleware
  if (!('data' in res.locals)) {
    next();
    return;
  }

  const status = res.locals.status || 200;
  const data = res.locals.data;

  res.status(status).json({
    success: true,
    data,
  });
};
