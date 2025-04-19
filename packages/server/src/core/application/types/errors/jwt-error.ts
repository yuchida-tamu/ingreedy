import { ApplicationError } from '@/core/application/types/errors/application-error';

export class JwtError extends ApplicationError {
  constructor(message: string) {
    super(message, 'JWT_ERROR', {});
    this.name = 'JwtError';
  }
}

export class JwtVerificationError extends JwtError {
  constructor(message: string = 'Jwt verification failed') {
    super(message);
    this.name = 'JwtVerificationError';
  }
}

export class JwtTokenExpiredError extends JwtError {
  constructor(message: string = 'Jwt token expired') {
    super(message);
    this.name = 'JwtTokenExpiredError';
  }
}

export class JwtTokenInvalidError extends JwtError {
  constructor(message: string = 'Jwt token invalid') {
    super(message);
    this.name = 'JwtTokenInvalidError';
  }
}
