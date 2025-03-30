import { IJwtService } from '@/core/application/services/jwt.service';
import {
  JwtTokenInvalidError,
  JwtVerificationError,
} from '@/core/application/types/errors/jwt-error';
import { ResultUtil } from '@/utils/result.util';
import jwt, { SignOptions } from 'jsonwebtoken';

export class JwtService implements IJwtService {
  private readonly secretKey: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY || 'secret';
    this.accessTokenExpiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1h';
    this.refreshTokenExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d';
  }

  generateTokens(userId: string): { accessToken: string; refreshToken: string } {
    const options: SignOptions = {
      expiresIn: this.accessTokenExpiration as jwt.SignOptions['expiresIn'],
    };
    const refreshOptions: SignOptions = {
      expiresIn: this.refreshTokenExpiration as jwt.SignOptions['expiresIn'],
    };

    const accessToken = jwt.sign({ userId }, this.secretKey, options);
    const refreshToken = jwt.sign({ userId }, this.secretKey, refreshOptions);

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.secretKey);

      if (typeof decoded === 'string') {
        return ResultUtil.error(new JwtTokenInvalidError());
      }

      if (decoded['userId'] === undefined) {
        return ResultUtil.error(new JwtTokenInvalidError());
      }

      return ResultUtil.success({ userId: decoded.userId } as const);
    } catch (error) {
      return ResultUtil.error(new JwtVerificationError());
    }
  }

  verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      if (typeof decoded === 'string') {
        return ResultUtil.error(new JwtTokenInvalidError());
      }

      if (decoded['userId'] === undefined) {
        return ResultUtil.error(new JwtTokenInvalidError());
      }

      return ResultUtil.success({ userId: decoded.userId } as const);
    } catch (error) {
      return ResultUtil.error(new JwtVerificationError());
    }
  }
}
