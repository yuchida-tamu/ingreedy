import { NextFunction, Request, Response } from 'express';
import { TUserResponseDto } from '../../core/application/types/dtos/user.dto';
import {
  UserNotFoundError,
  UserValidationError,
} from '../../core/application/types/errors/user-error';
import { JwtService } from '../../services/auth/jwt-service';
import { UserService } from '../../services/user/user-service';
import { UserController } from '../user-controller';

// Mock the UserService
jest.mock('../../services/user/user-service');

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockUserService = {
      getUserById: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    mockJwtService = {
      generateTokens: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    userController = new UserController(mockUserService, mockJwtService);

    // Setup mock request/response/next
    mockRequest = {
      query: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('getUser', () => {
    it('should return user data with 200 status when successful', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockUser: TUserResponseDto = {
        id: mockUserId,
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRequest.query = { id: mockUserId };

      mockUserService.getUserById.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      // Act
      await userController.getUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when getUserById returns error', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockError = new UserNotFoundError({
        message: 'User not found',
      });
      mockRequest.query = { id: mockUserId };

      mockUserService.getUserById.mockResolvedValue({
        success: false,
        error: mockError,
      });

      // Act
      await userController.getUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with error when an exception occurs', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockError = new Error('Unexpected error');
      mockRequest.query = { id: mockUserId };

      mockUserService.getUserById.mockRejectedValue(mockError);

      // Act
      await userController.getUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create user and return 201 status when successful', async () => {
      // Arrange
      const mockUserData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const mockCreatedUser: TUserResponseDto = {
        id: 'new-user-id',
        email: mockUserData.email,
        username: mockUserData.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };
      mockRequest.body = mockUserData;

      mockUserService.createUser.mockResolvedValue({
        success: true,
        data: mockCreatedUser,
      });

      mockJwtService.generateTokens.mockReturnValue({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      });

      // Act
      await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(mockJwtService.generateTokens).toHaveBeenCalledWith(mockCreatedUser.id);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockTokens.accessToken,
        expect.any(Object),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.any(Object),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when createUser returns error', async () => {
      // Arrange
      const mockUserData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const mockError = new UserValidationError({
        message: 'Validation failed',
      });
      mockRequest.body = mockUserData;

      mockUserService.createUser.mockResolvedValue({
        success: false,
        error: mockError,
      });

      // Act
      await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with error when an exception occurs', async () => {
      // Arrange
      const mockUserData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const mockError = new Error('Unexpected error');
      mockRequest.body = mockUserData;

      mockUserService.createUser.mockRejectedValue(mockError);

      // Act
      await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
