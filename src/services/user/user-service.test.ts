import bcrypt from 'bcrypt';
import type { IUserRepository } from '../../core/application/repositories/user.repository';
import type { TNewUserDto } from '../../core/application/types/dtos/user.dto';
import {
  UserAlreadyExistsError,
  UserCreationFailedError,
  UserError,
  UserNotFoundError,
} from '../../core/application/types/errors/user-error';
import { UserService } from './user-service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mock-salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUser: TNewUserDto;

  beforeEach(() => {
    // Create mock repository
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    // Initialize service with mock repository
    userService = new UserService(mockUserRepository);

    // Setup mock user data
    mockUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };
  });

  describe('createUser', () => {
    it('should successfully create a new user', async () => {
      // Arrange
      const createdAt = new Date();
      const updatedAt = new Date();
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'mock-id',
        ...mockUser,
        password: 'hashed-password',
        createdAt,
        updatedAt,
      });

      // Act
      const result = await userService.createUser(mockUser);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: 'mock-id',
          email: mockUser.email,
          username: mockUser.username,
          createdAt,
          updatedAt,
        });
      }
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 'mock-salt');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashed-password',
      });
    });

    it('should return error when user already exists', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'existing-id',
        ...mockUser,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await userService.createUser(mockUser);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UserAlreadyExistsError);
        expect(result.error.message).toBe('User already exists');
      }
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors during creation', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.createUser(mockUser);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UserCreationFailedError);
        expect(result.error.message).toBe('Failed to create user');
      }
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const user = {
        id: 'mock-id',
        ...mockUser,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.findById.mockResolvedValue(user);

      // Act
      const result = await userService.getUserById('mock-id');

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      }
      expect(mockUserRepository.findById).toHaveBeenCalledWith('mock-id');
    });

    it('should return error when user is not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.getUserById('non-existent-id');

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UserNotFoundError);
        expect(result.error.message).toBe('User not found');
      }
    });

    it('should handle repository errors during fetch', async () => {
      // Arrange
      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.getUserById('mock-id');

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UserError);
        expect(result.error.message).toBe('Database error');
      }
    });
  });

  describe('updateUser', () => {
    const userId = 'mock-id';
    const existingUser = {
      id: userId,
      email: 'existing@example.com',
      username: 'existinguser',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully update user data', async () => {
      // Arrange
      const updateData = { username: 'newusername' };
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue({
        ...existingUser,
        ...updateData,
        updatedAt: new Date(),
      });

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe(updateData.username);
      }
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
    });

    it('should hash password when updating password', async () => {
      // Arrange
      const updateData = { password: 'newpassword123' };
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue({
        ...existingUser,
        password: 'hashed-password',
        updatedAt: new Date(),
      });

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result.success).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith(updateData.password, 'mock-salt');
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        password: 'hashed-password',
      });
    });

    it('should return error when user not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.updateUser(userId, { username: 'newname' });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UserNotFoundError);
      }
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should return error when updating to existing email', async () => {
      // Arrange
      const updateData = { email: 'taken@example.com' };
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.findByEmail.mockResolvedValue({
        ...existingUser,
        id: 'other-id',
        email: updateData.email,
      });

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(UserAlreadyExistsError);
      }
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
