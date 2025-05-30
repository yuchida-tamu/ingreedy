import type { IUserRepository } from '@/core/application/repositories/user.repository';
import type { User } from '@/core/domain/user/user.entity';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryUserRepository implements IUserRepository {
  update(_id: string, _data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    throw new Error('Method not implemented.');
  }
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}
