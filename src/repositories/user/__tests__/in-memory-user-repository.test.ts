import { User } from '../../../core/domain/user/user.entity';
import { InMemoryUserRepository } from '../in-memory-user-repository';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;
  let mockUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    mockUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };
  });

  describe('create', () => {
    it('should create a new user with generated id and timestamps', async () => {
      // Act
      const createdUser = await repository.create(mockUser);

      // Assert
      expect(createdUser).toEqual({
        ...mockUser,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(createdUser.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ); // UUID v4 format
    });

    it('should store the created user in memory', async () => {
      // Act
      const createdUser = await repository.create(mockUser);
      const foundUser = await repository.findById(createdUser.id);

      // Assert
      expect(foundUser).toEqual(createdUser);
    });
  });

  describe('findById', () => {
    it('should return null when user is not found', async () => {
      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return user when found', async () => {
      // Arrange
      const createdUser = await repository.create(mockUser);

      // Act
      const foundUser = await repository.findById(createdUser.id);

      // Assert
      expect(foundUser).toEqual(createdUser);
    });
  });

  describe('findByEmail', () => {
    it('should return null when user is not found', async () => {
      // Act
      const result = await repository.findByEmail('non-existent@example.com');

      // Assert
      expect(result).toBeNull();
    });

    it('should return user when found by email', async () => {
      // Arrange
      const createdUser = await repository.create(mockUser);

      // Act
      const foundUser = await repository.findByEmail(mockUser.email);

      // Assert
      expect(foundUser).toEqual(createdUser);
    });

    it('should handle multiple users and return correct one', async () => {
      // Arrange
      const user1 = await repository.create(mockUser);
      const user2 = await repository.create({
        ...mockUser,
        email: 'another@example.com',
        username: 'another',
      });

      // Act
      const foundUser = await repository.findByEmail(user2.email);

      // Assert
      expect(foundUser).toEqual(user2);
      expect(foundUser).not.toEqual(user1);
    });
  });

  describe('repository state', () => {
    it('should maintain separate state between instances', () => {
      // Arrange
      const repository1 = new InMemoryUserRepository();
      const repository2 = new InMemoryUserRepository();

      // Act & Assert
      expect(repository1).not.toBe(repository2);
    });

    it('should maintain data between operations', async () => {
      // Arrange
      const user1 = await repository.create(mockUser);
      const user2 = await repository.create({
        ...mockUser,
        email: 'another@example.com',
        username: 'another',
      });

      // Act
      const foundUser1 = await repository.findById(user1.id);
      const foundUser2 = await repository.findByEmail(user2.email);

      // Assert
      expect(foundUser1).toEqual(user1);
      expect(foundUser2).toEqual(user2);
    });
  });
});
