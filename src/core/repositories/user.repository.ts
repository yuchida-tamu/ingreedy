import { User } from '../domain/user/user.entity';

/**
 * Interface for user repository operations.
 * This is part of the core domain and should not contain implementation details.
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}
