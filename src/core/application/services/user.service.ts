import { TNewUserDto, TUserResponseDto } from '@/core/application/types/dtos/user.dto';
import { TResult } from '@/core/application/types/result';

export interface IUserService {
  getUserById(userId: string): Promise<TResult<TUserResponseDto>>;
  createUser(userData: TNewUserDto): Promise<TResult<TUserResponseDto>>;
}
