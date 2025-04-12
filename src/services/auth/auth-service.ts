import type { JwtService } from '@/services/auth/jwt-service';
import type { UserService } from '@/services/user/user-service';
import bcrypt from 'bcrypt';
import { ResultUtil } from '../../utils/result.util';

export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const result = await this.userService.getUserByEmail(email);
    if (!result.success) {
      return ResultUtil.fail(result.error);
    }

    const user = result.data;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ResultUtil.fail(new Error('Invalid password'));
    }

    const { accessToken, refreshToken } = this.jwtService.generateTokens(user.id);
    return ResultUtil.success({
      accessToken,
      refreshToken,
    });
  }

  logout(): void {
    // For now, logout simply clears the refresh token (handled in the controller)
    // If refresh tokens are stored in a database, implement revocation logic here
  }
}