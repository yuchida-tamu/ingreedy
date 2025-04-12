import type { User } from '@/core/domain/user/user.entity';

/**
 * Interface for user repository operations.
 * This is part of the core domain and should not contain implementation details.
 */
export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null>;
  abstract update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User | null>;
}
