import type {
  TNewUserDto,
  TUpdateUserDto,
  TUserResponseDto,
} from '@/core/application/types/dtos/user.dto';
import type { TResult } from '@/core/application/types/result';

export interface IUserService {
  createUser(data: TNewUserDto): Promise<TResult<TUserResponseDto>>;
  getUserById(id: string): Promise<TResult<TUserResponseDto>>;
  updateUser(id: string, data: TUpdateUserDto): Promise<TResult<TUserResponseDto>>;
}
