import { NextFunction, Request, Response } from 'express';
import {
  InternalServerError,
  UserAlreadyExistsError,
  UserCreationFailedError,
  UserNotFoundError,
  UserValidationError,
} from '../../core/application/types/errors/user-error';
import { errorHandler } from '../error.middleware';

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: '/test',
      method: 'GET',
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    nextFunction = jest.fn();
  });

  it('should handle UserNotFoundError correctly', () => {
    const error = new UserNotFoundError({ userId: '123' });

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'User not found',
        code: 'U004',
      },
    });
  });

  it('should handle UserAlreadyExistsError correctly', () => {
    const error = new UserAlreadyExistsError({ email: 'test@example.com' });

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'User already exists',
        code: 'U001',
      },
    });
  });

  it('should handle UserValidationError correctly', () => {
    const error = new UserValidationError({ field: 'email', message: 'Invalid email' });

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'U003',
      },
    });
  });

  it('should handle UserCreationFailedError correctly', () => {
    const error = new UserCreationFailedError({ reason: 'Database error' });

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Failed to create user',
        code: 'U002',
      },
    });
  });

  it('should handle InternalServerError correctly', () => {
    const error = new InternalServerError({ reason: 'Unexpected error' });

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'U005',
      },
    });
  });

  it('should handle unknown errors by wrapping them in InternalServerError', () => {
    const error = new Error('Random error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Random error',
        code: 'U005',
      },
    });
  });

  it('should use unknown error code for unrecognized error codes', () => {
    const error = new UserNotFoundError({ userId: '123' });
    // @ts-expect-error - Deliberately breaking the error code for testing
    error.code = 'NONEXISTENT_CODE';

    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'User not found',
        code: 'U000',
      },
    });
  });
});
