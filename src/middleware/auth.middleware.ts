import type { IJwtService } from '@/core/application/services/jwt.service';
import { UnauthorizedError } from '@/core/application/types/errors/auth-error';
import type { NextFunction, Request, Response } from 'express';

export const authenticateJwt = (jwtService: IJwtService) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies['accessToken'];
      if (!accessToken) {
        return next(new UnauthorizedError('Access token is missing'));
      }

      const result = await jwtService.verifyAccessToken(accessToken);
      if (!result.success) {
        return next(new UnauthorizedError('Invalid access token'));
      }

      // Set user with non-null assertion since we've validated the token
      req.user = { id: result.data.userId } as const;
      next();
    } catch (error) {
      next(new UnauthorizedError('Invalid access token'));
    }
  };
};

export class AuthMiddleware {
  constructor(private jwtService: IJwtService) {}

  attachTokens = (_: Request, res: Response, next: NextFunction): void => {
    const userId = res.locals.userId;
    if (!userId) {
      next();
      return;
    }

    const { accessToken, refreshToken } = this.jwtService.generateTokens(userId);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    next();
  };
}
