import { config } from '@/config';
import type { IUserRepository } from '@/core/application/repositories/user.repository';
import type { IUserService } from '@/core/application/services/user.service';
import type {
  TNewUserDto,
  TUpdateUserDto,
  TUserResponseDto,
} from '@/core/application/types/dtos/user.dto';
import {
  UserAlreadyExistsError,
  UserCreationFailedError,
  UserError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '@/core/application/types/errors/user-error';
import { ResultUtil } from '@/utils/result.util';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
  private readonly SALT_ROUNDS = config.auth.saltRounds;

  constructor(private userRepository: IUserRepository) {}

  async getUserById(userId: string) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResultUtil.error(
          new UserNotFoundError({
            message: `User with id ${userId} not found`,
          }),
        );
      }

      return ResultUtil.success(this.mapToUserResponse(user));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.error(new UserError(message));
    }
  }

  async createUser(userData: TNewUserDto) {
    try {
      const { email, password, username } = userData;
      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return ResultUtil.error(
          new UserAlreadyExistsError({
            message: `User with email ${email} already exists`,
          }),
        );
      }

      // Create new user with hashed password
      const newUser = await this.userRepository.create({
        email,
        username,
        password: await this.hashPassword(password),
      });

      return ResultUtil.success(this.mapToUserResponse(newUser));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.error(new UserCreationFailedError({ message }));
    }
  }

  async updateUser(userId: string, updateData: TUpdateUserDto) {
    try {
      const { email, password, username } = updateData;
      // Check if user exists
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        return ResultUtil.error(
          new UserNotFoundError({
            message: `User with id ${userId} not found`,
          }),
        );
      }

      // If email is being updated, check if it's already taken
      if (email && email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(email);
        if (userWithEmail) {
          return ResultUtil.error(
            new UserAlreadyExistsError({
              message: `User with email ${email} already exists`,
            }),
          );
        }
      }

      // Hash password if it's being updated
      const dataToUpdate = {
        email,
        username,
        password: password ? await this.hashPassword(password) : undefined,
      } as const;

      // Update user
      const updatedUser = await this.userRepository.update(userId, dataToUpdate);
      return ResultUtil.success(this.mapToUserResponse(updatedUser));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.error(new UserUpdateFailedError({ message }));
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  private mapToUserResponse(user: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  }): TUserResponseDto {
    const { id, email, username, createdAt, updatedAt } = user;
    return {
      id,
      email,
      username,
      createdAt,
      updatedAt,
    } as const satisfies TUserResponseDto;
  }
}
