import { TApiResponse } from '@/types/api/response';
import { ApplicationError } from '@/types/errors/application-error';
import { InternalServerError } from '@/types/errors/user-error';
import { NextFunction, Request, Response } from 'express';

// Map domain error codes to HTTP status codes
const ERROR_STATUS_MAP: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  USER_CREATION_FAILED: 500,
  VALIDATION_ERROR: 400,
  USER_NOT_FOUND: 404,
};

const ERROR_CODE_MAP: Record<string, string> = {
  UNKNOWN_ERROR: 'U000',
  USER_ALREADY_EXISTS: 'U001',
  USER_CREATION_FAILED: 'U002',
  VALIDATION_ERROR: 'U003',
  USER_NOT_FOUND: 'U004',
  INTERNAL_SERVER_ERROR: 'U005',
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

  const response = {
    success: false,
    error: {
      message: errorInstance.message,
      code: ERROR_CODE_MAP[errorInstance.code],
    },
  } as const satisfies TApiResponse<never>;

  res.status(ERROR_STATUS_MAP[errorInstance.code]).json(response);
};
