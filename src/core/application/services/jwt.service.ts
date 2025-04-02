import type { TResult } from '@/core/application/types/result';

export interface IJwtService {
  generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  };

  verifyAccessToken(token: string): TResult<{ userId: string }>;
  verifyRefreshToken(token: string): TResult<{ userId: string }>;
}
