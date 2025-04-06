import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../core/application/types/api/request';
import type { TUserResponseDto } from '../../core/application/types/dtos/user.dto';
import {
  UserNotFoundError,
  UserValidationError,
} from '../../core/application/types/errors/user-error';
import type { UserService } from '../../services/user/user-service';
import { UserController } from '../user/user-controller';
// Mock the UserService
jest.mock('../../services/user/user-service');

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockUserService = {
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    userController = new UserController(mockUserService);

    // Setup mock request/response/next
    mockRequest = {
      query: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      locals: {},
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
      mockRequest = { user: { id: mockUserId } };

      mockUserService.getUserById.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      // Act
      await userController.getUser(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(mockResponse.locals?.data).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with error when getUserById returns error', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockError = new UserNotFoundError({
        message: 'User not found',
      });
      mockRequest = { user: { id: mockUserId } };

      mockUserService.getUserById.mockResolvedValue({
        success: false,
        error: mockError,
      });

      // Act
      await userController.getUser(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

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
      mockRequest = { user: { id: mockUserId } };

      mockUserService.getUserById.mockRejectedValue(mockError);

      // Act
      await userController.getUser(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

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
      mockRequest.body = mockUserData;

      mockUserService.createUser.mockResolvedValue({
        success: true,
        data: mockCreatedUser,
      });

      // Act
      await userController.createUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(mockResponse.locals?.data).toEqual(mockCreatedUser);
      expect(mockNext).toHaveBeenCalled();
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

  describe('updateUser', () => {
    it('should update user and return 200 status when successful', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockUpdateData = { username: 'newusername' };
      const mockUpdatedUser: TUserResponseDto = {
        id: mockUserId,
        email: 'test@example.com',
        username: mockUpdateData.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRequest = {
        user: { id: mockUserId },
        body: mockUpdateData,
      };

      mockUserService.updateUser = jest.fn().mockResolvedValue({
        success: true,
        data: mockUpdatedUser,
      });

      // Act
      await userController.updateUser(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUserId, mockUpdateData);
      expect(mockResponse.locals?.data).toEqual(mockUpdatedUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with error when updateUser returns error', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockUpdateData = { email: 'taken@example.com' };
      const mockError = new UserValidationError({
        message: 'Email already exists',
      });
      mockRequest = {
        user: { id: mockUserId },
        body: mockUpdateData,
      };

      mockUserService.updateUser = jest.fn().mockResolvedValue({
        success: false,
        error: mockError,
      });

      // Act
      await userController.updateUser(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUserId, mockUpdateData);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with error when an exception occurs', async () => {
      // Arrange
      const mockUserId = 'test-user-id';
      const mockUpdateData = { username: 'newname' };
      const mockError = new Error('Unexpected error');
      mockRequest = {
        user: { id: mockUserId },
        body: mockUpdateData,
      };

      mockUserService.updateUser = jest.fn().mockRejectedValue(mockError);

      // Act
      await userController.updateUser(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUserId, mockUpdateData);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
