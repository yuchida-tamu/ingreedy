import { TNewUserDto, TUserResponseDto } from '@/types/dtos/user.dto';
import { TResult } from '@/types/result';

export interface IUserService {
  getUserById(userId: string): Promise<TResult<TUserResponseDto>>;
  createUser(userData: TNewUserDto): Promise<TResult<TUserResponseDto>>;
}
