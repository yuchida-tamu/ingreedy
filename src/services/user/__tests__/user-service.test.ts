import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../core/repositories/user.repository';
import { TNewUserDto } from '../../../types/dtos/user.dto';
import {
  UserAlreadyExistsError,
  UserCreationFailedError,
  UserError,
  UserNotFoundError,
} from '../../../types/errors/user-error';
import { UserService } from '../user-service';

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
    };

    // Initialize service with mock repository
    userService = new UserService(mockUserRepository);

    // Setup mock user data
    mockUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
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
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
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
          firstName: user.firstName,
          lastName: user.lastName,
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
});
