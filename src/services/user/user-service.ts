import { config } from '@/config';
import { IUserRepository } from '@/core/application/repositories/user.repository';
import { IUserService } from '@/core/application/services/user.service';
import { TNewUserDto, TUserResponseDto } from '@/core/application/types/dtos/user.dto';
import {
  UserAlreadyExistsError,
  UserCreationFailedError,
  UserError,
  UserNotFoundError,
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
      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return ResultUtil.error(
          new UserAlreadyExistsError({
            message: `User with email ${userData.email} already exists`,
          }),
        );
      }

      // Create new user with hashed password
      const newUser = await this.userRepository.create({
        ...userData,
        password: await this.hashPassword(userData.password),
      });

      return ResultUtil.success(this.mapToUserResponse(newUser));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.error(new UserCreationFailedError({ message }));
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
