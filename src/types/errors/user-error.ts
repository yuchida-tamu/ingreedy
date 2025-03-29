import { ApplicationError } from './application-error';

const USER_ERROR_CODES = {
  BASE: 'USER_ERROR',
  NOT_FOUND: 'USER_NOT_FOUND',
  ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  CREATION_FAILED: 'USER_CREATION_FAILED',
  VALIDATION_FAILED: 'USER_VALIDATION_FAILED',
} as const;

export class UserError extends ApplicationError {
  constructor(
    message: string,
    code: string = USER_ERROR_CODES.BASE,
    details: Record<string, string> = {},
  ) {
    super(message, code, details);
    this.name = 'UserError';
  }
}

export class UserValidationError extends UserError {
  constructor(details: Record<string, string>) {
    super('Validation failed', USER_ERROR_CODES.VALIDATION_FAILED, details);
    this.name = 'UserValidationError';
  }
}

export class UserNotFoundError extends UserError {
  constructor(details: Record<string, string>) {
    super('User not found', USER_ERROR_CODES.NOT_FOUND, details);
    this.name = 'UserNotFoundError';
  }
}

export class UserAlreadyExistsError extends UserError {
  constructor(details: Record<string, string>) {
    super('User already exists', USER_ERROR_CODES.ALREADY_EXISTS, details);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserCreationFailedError extends UserError {
  constructor(details: Record<string, string>) {
    super('Failed to create user', USER_ERROR_CODES.CREATION_FAILED, details);
    this.name = 'UserCreationFailedError';
  }
}
