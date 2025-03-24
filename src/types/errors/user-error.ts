import { ApplicationError } from './application-error';

const USER_SERVICE_ERROR_CODES = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const satisfies Record<string, string>;

type ErrorDetails = Record<'message', string>;

export class UserValidationError extends ApplicationError {
  constructor(details: ErrorDetails) {
    super('Validation failed', USER_SERVICE_ERROR_CODES.VALIDATION_ERROR, details);
  }
}

export class UserNotFoundError extends ApplicationError {
  constructor(details: ErrorDetails) {
    super('User not found', USER_SERVICE_ERROR_CODES.USER_NOT_FOUND, details);
  }
}

export class UserAlreadyExistsError extends ApplicationError {
  constructor(details: ErrorDetails) {
    super('User already exists', USER_SERVICE_ERROR_CODES.USER_ALREADY_EXISTS, details);
  }
}

export class UserCreationFailedError extends ApplicationError {
  constructor(details: ErrorDetails) {
    super('Failed to create user', USER_SERVICE_ERROR_CODES.USER_CREATION_FAILED, details);
  }
}

export class InternalServerError extends ApplicationError {
  constructor(details: ErrorDetails) {
    super('Internal server error', USER_SERVICE_ERROR_CODES.INTERNAL_SERVER_ERROR, details);
  }
}
