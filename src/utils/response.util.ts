import type { ApplicationError } from '@/core/application/types/errors/application-error';
import type { Response } from 'express';

/**
 * Sets response data and metadata in res.locals for middleware processing
 * @param res - Express Response object
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @param type - Response type (default: 'json')
 */
export function setResponse(res: Response, data: unknown, status = 200): void {
  res.locals.data = data;
  res.locals.status = status;
}

/**
 * Sets error response data in res.locals
 * @param res - Express Response object
 * @param error - Error object
 * @param status - HTTP status code (default: 500)
 */
export function setErrorResponse(res: Response, error: ApplicationError, status = 500): void {
  res.locals.data = {
    message: error.message,
    code: error.code,
  };
  res.locals.status = status;
}
