import { HttpError } from '@/core/application/types/errors/http-error';
import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware to handle HTTP responses consistently.
 * Looks for data, status, and type in res.locals.
 * Supports different response types (json, file, stream).
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

/**
 * Error handling middleware.
 * Formats error responses consistently.
 */
export const errorResponseHandler = (
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const httpError = error instanceof HttpError ? error : new HttpError(error.message);
  const status = httpError.status || 500;
  const code = httpError.code || 'INTERNAL_SERVER_ERROR';

  res.status(status).json({
    success: false,
    error: {
      message: httpError.message,
      code,
    },
  });
};
