import { ApplicationError } from './application-error';

const USER_SERVICE_ERROR_CODES = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const satisfies Record<string, string>;

export class UserAlreadyExistsError extends ApplicationError {
  constructor(details: Record<string, string>) {
    super('User already exists', USER_SERVICE_ERROR_CODES.USER_ALREADY_EXISTS, details);
  }
}

export class UserCreationFailedError extends ApplicationError {
  constructor(details: Record<string, string>) {
    super('User creation failed', USER_SERVICE_ERROR_CODES.USER_CREATION_FAILED, details);
  }
}

export class UserValidationError extends ApplicationError {
  constructor(details: Record<string, string>) {
    super('Validation error', USER_SERVICE_ERROR_CODES.VALIDATION_ERROR, details);
  }
}

export class InternalServerError extends ApplicationError {
  constructor(details: Record<string, string>) {
    super('Internal server error', 'INTERNAL_SERVER_ERROR', details);
  }
}
