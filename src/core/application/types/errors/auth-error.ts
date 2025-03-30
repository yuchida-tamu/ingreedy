import { ApplicationError } from './application-error';

export class AuthError extends ApplicationError {
  constructor(
    message: string = 'Authentication error occurred',
    code: string = 'AUTH_ERROR',
    details: Record<string, string> = {},
  ) {
    super(message, code, details);
    this.name = 'AuthError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(
    message: string = 'Unauthorized access',
    code: string = 'UNAUTHORIZED',
    details: Record<string, string> = {},
  ) {
    super(message, code, details);
    this.name = 'UnauthorizedError';
  }
}
