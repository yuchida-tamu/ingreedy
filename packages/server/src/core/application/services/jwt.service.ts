import type { TResult } from '@/core/application/types/result';

export abstract class IJwtService {
  abstract generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  };

  abstract verifyAccessToken(token: string): TResult<{ userId: string }>;
  abstract verifyRefreshToken(token: string): TResult<{ userId: string }>;
}
