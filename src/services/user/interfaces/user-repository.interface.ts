import { TUser } from '@/types/entities/user';

export interface IUserRepository {
  findById(id: string): Promise<TUser | null>;
  findByEmail(email: string): Promise<TUser | null>;
  create(user: Omit<TUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<TUser>;
}
