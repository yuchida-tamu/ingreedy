import { TResult } from '@/types/common';
import { TNewUserDto, TUserResponseDto } from '@/types/dtos/user.dto';
import { TUser } from '@/types/entities/user';
import { TUserDomainError } from '@/types/errors/domain-error';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  // In-memory storage for now, will be replaced with database
  private users: TUser[] = [];

  async createUser(userData: TNewUserDto): Promise<TResult<TUserResponseDto, TUserDomainError>> {
    try {
      // Check if user with email already exists
      const existingUser = this.users.find((user) => user.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: {
            code: 'USER_ALREADY_EXISTS',
            message: 'User with this email already exists',
            details: { email: userData.email },
          },
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const newUser: TUser = {
        ...userData,
        id: uuidv4(),
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store user
      this.users.push(newUser);

      // Return user data without password
      const { id, email, username, firstName, lastName, createdAt, updatedAt } = newUser;
      return {
        success: true,
        data: {
          id,
          email,
          username,
          firstName,
          lastName,
          createdAt,
          updatedAt,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'USER_CREATION_FAILED',
          message: 'Failed to create user',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
