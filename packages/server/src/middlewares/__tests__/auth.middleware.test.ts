import type { NextFunction, Request, Response } from 'express';
import type { IJwtService } from '../../core/application/services/jwt.service';
import type { AuthenticatedRequest } from '../../core/application/types/api/request';
import { ApplicationError } from '../../core/application/types/errors/application-error';
import { UnauthorizedError } from '../../core/application/types/errors/auth-error';
import type { TResult } from '../../core/application/types/result';
import { withAuth } from '../auth.middleware';

describe('Auth Middleware', () => {
  let mockJwtService: jest.Mocked<IJwtService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Mock JWT service
    mockJwtService = {
      verifyAccessToken: jest.fn<TResult<{ userId: string }>, [string]>(),
      verifyRefreshToken: jest.fn<TResult<{ userId: string }>, [string]>(),
      generateTokens: jest.fn().mockReturnValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }),
    };

    // Mock request
    mockRequest = {
      cookies: {},
      user: undefined,
    };

    // Mock response
    mockResponse = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };

    // Mock next function
    mockNext = jest.fn();
  });

  describe('authenticateJwt', () => {
    it('should call next with UnauthorizedError when no access token is present', () => {
      const { authenticate } = withAuth(mockJwtService);
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new UnauthorizedError('Invalid or missing access token'),
      );
    });

    it('should call next with UnauthorizedError when token verification fails', () => {
      mockRequest.cookies = { accessToken: 'invalid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue({
        success: false,
        error: new ApplicationError('Invalid token', 'AUTH_ERROR', { token: 'invalid-token' }),
      });
      const { authenticate } = withAuth(mockJwtService);
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJwtService.verifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError('Verification failed'));
    });

    it('should set user and call next when token is valid', () => {
      mockRequest.cookies = { accessToken: 'valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue({
        success: true,
        data: { userId: 'test-user-id' },
      });
      const { authenticate } = withAuth(mockJwtService);
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.user).toEqual({ id: 'test-user-id' });
    });

    it('should handle unexpected errors during token verification', () => {
      mockRequest.cookies = { accessToken: 'valid-token' };
      mockJwtService.verifyAccessToken.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      const { authenticate } = withAuth(mockJwtService);
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError('Invalid access token'));
    });
  });

  describe('attachTokens', () => {
    it('should call next when no userId is present in res.locals', () => {
      const { attachTokens } = withAuth(mockJwtService);
      attachTokens(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockJwtService.generateTokens).not.toHaveBeenCalled();
    });

    it('should attach tokens and send response when userId and data are present', () => {
      mockResponse.locals = {
        userId: 'test-user-id',
        data: { id: 'test-user-id', email: 'test@example.com' },
        status: 201,
      };

      const { attachTokens } = withAuth(mockJwtService);
      attachTokens(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJwtService.generateTokens).toHaveBeenCalledWith('test-user-id');
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'accessToken',
        'new-access-token',
        expect.any(Object),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh-token',
        expect.any(Object),
      );
    });

    it('should attach tokens and call next when userId is present but no data', () => {
      mockResponse.locals = {
        data: { id: 'test-user-id' },
      };
      mockJwtService.generateTokens.mockReturnValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      const { attachTokens } = withAuth(mockJwtService);
      attachTokens(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJwtService.generateTokens).toHaveBeenCalledWith('test-user-id');
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
