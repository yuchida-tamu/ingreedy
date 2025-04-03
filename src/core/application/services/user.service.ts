import type {
  TNewUserDto,
  TUpdateUserDto,
  TUserResponseDto,
} from '@/core/application/types/dtos/user.dto';
import type { TResult } from '@/core/application/types/result';

export abstract class IUserService {
  abstract createUser(data: TNewUserDto): Promise<TResult<TUserResponseDto>>;
  abstract getUserById(id: string): Promise<TResult<TUserResponseDto>>;
  abstract updateUser(id: string, data: TUpdateUserDto): Promise<TResult<TUserResponseDto>>;
}
