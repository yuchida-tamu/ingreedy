import { TApiResponse } from '@/types/api/response';
import { ApplicationError } from '@/types/errors/application-error';
import { InternalServerError } from '@/types/errors/user-error';
import { NextFunction, Request, Response } from 'express';

// Map domain error codes to HTTP status codes
const errorStatusMap: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  USER_CREATION_FAILED: 500,
  VALIDATION_ERROR: 400,
  USER_NOT_FOUND: 404,
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Log error details
  console.error('Error occurred:', {
    path: req.path,
    method: req.method,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  });

  // If it's our application error, use its code for status
  const errorInstance =
    error instanceof ApplicationError
      ? error
      : new InternalServerError({
          message: error.message || 'Unknown error',
        });

  const status = errorStatusMap[errorInstance.code] || 500;
  const response = {
    success: false,
    error: errorInstance,
  } as const satisfies TApiResponse<never>;

  res.status(status).json(response);
};
