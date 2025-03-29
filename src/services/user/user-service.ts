import { IUserService } from '@/core/application/services/user.service';
import { IUserRepository } from '@/core/repositories/user.repository';
import { TNewUserDto, TUserResponseDto } from '@/types/dtos/user.dto';
import {
  UserAlreadyExistsError,
  UserCreationFailedError,
  UserNotFoundError,
} from '@/types/errors/user-error';
import { TResult } from '@/types/result';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserById(userId: string): Promise<TResult<TUserResponseDto>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: new UserNotFoundError({
            message: `User with id ${userId} not found`,
          }),
        };
      }

      const { id, email, username, firstName, lastName, createdAt, updatedAt } = user;
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
        error: new UserNotFoundError({
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      };
    }
  }

  async createUser(userData: TNewUserDto): Promise<TResult<TUserResponseDto>> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: new UserAlreadyExistsError({
            message: `User with email ${userData.email} already exists`,
          }),
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

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
        error: new UserCreationFailedError({
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      };
    }
  }
}
