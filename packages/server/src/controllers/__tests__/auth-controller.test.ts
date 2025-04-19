import type { Request, Response } from 'express';
import type { IAuthService } from '../../core/application/services/auth.service';
import { AuthError } from '../../core/application/types/errors/auth-error';
import { AuthController } from '../auth/auth-controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<IAuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    authService = {
      login: jest.fn(),
      logout: jest.fn(),
    } as jest.Mocked<IAuthService>;
    authController = new AuthController(authService);

    mockRequest = {
      query: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      locals: {},
    };
    next = jest.fn();
  });

  describe('login', () => {
    it('should return access token and set refresh token cookie on successful login', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      authService.login.mockResolvedValue({
         success: true,
        data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
      });

      await authController.login(mockRequest as Request, mockResponse as Response, next);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });

    it('should return 401 if login fails', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'wrongpassword' };
      authService.login.mockResolvedValue({
        success: false,
        error: new AuthError('Invalid email or password'),});

      await authController.login(mockRequest as Request, mockResponse as Response, next);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(next).toHaveBeenCalledWith(new AuthError('Invalid email or password'));
    });
  });

  describe('logout', () => {
    it('should clear refresh token cookie and return success message', async () => {
      await authController.logout(mockRequest as Request, mockResponse as Response, next);

      expect(mockResponse.clearCookie).toHaveBeenCalled()
      expect(mockResponse.locals!.status).toEqual(200);
      expect(mockResponse.locals!.data).toEqual({ message: 'Logout successful' });
    });
  });
});