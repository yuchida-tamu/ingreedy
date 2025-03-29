import { IUserRepository } from '@/core/repositories/user.repository';
import { TUser } from '@/types/entities/user';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryUserRepository implements IUserRepository {
  private users: TUser[] = [];

  async findById(id: string): Promise<TUser | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<TUser | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async create(userData: Omit<TUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<TUser> {
    const newUser: TUser = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}
