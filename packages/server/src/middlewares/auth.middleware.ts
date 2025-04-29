import type { IJwtService } from '@/core/application/services/jwt.service';
import { UnauthorizedError } from '@/core/application/types/errors/auth-error';
import type { NextFunction, Request, Response } from 'express';

type TokenConfig = {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
};

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

const DEFAULT_TOKEN_CONFIG: TokenConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

const authenticateJwt = (jwtService: IJwtService): MiddlewareFunction => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies['accessToken'];
      if (!token) {
        res.locals.status = 401;
        res.locals.data = {
          status: 0,
          message: 'Unauthorized',
        };
        next(new UnauthorizedError('Invalid or missing access token'));
        return;
      }

      const result = jwtService.verifyAccessToken(token);
      const userId = result.success ? result.data.userId : null;
      if (!userId) {
        res.locals.status = 401;
        res.locals.data = {
          status: 0,
          message: 'Unauthorized',
        };
        next(new UnauthorizedError('Verification failed'));
        return;
      }

      req.user = { id: userId } as const;
      next();
    } catch (error) {
      next(new UnauthorizedError('Invalid access token'));
    }
  };
};

const attachTokens = (jwtService: IJwtService): MiddlewareFunction => {
  return (_: Request, res: Response, next: NextFunction): void => {
    const data = res.locals.data as { id: string };

    if (!data) {
      next(new UnauthorizedError('Invalid or missing access token'));
      return;
    }

    const userId = data.id;
    if (!userId) {
      next(new UnauthorizedError('Invalid or missing access token'));
      return;
    }

    const { accessToken, refreshToken } = jwtService.generateTokens(userId);
    res.cookie('accessToken', accessToken, DEFAULT_TOKEN_CONFIG);
    res.cookie('refreshToken', refreshToken, DEFAULT_TOKEN_CONFIG);

    next();
  };
};

const statusCheck = (jwtService: IJwtService): MiddlewareFunction => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies['accessToken'];
      if (!token) {
        res.locals.data = {
          status: 0,
          message: 'Unauthorized',
        };
        next();
        return;
      }

      const result = jwtService.verifyAccessToken(token);
      const userId = result.success ? result.data.userId : null;
      if (!userId) {
        res.locals.data = {
          status: 0,
          message: 'Unauthorized',
        };
        next();
        return;
      }

      req.user = { id: userId } as const;
      res.locals.data = {
        status: 1,
        message: 'Authorized',
      };
      next();
    } catch (error) {
      next(new UnauthorizedError('Invalid access token'));
    }
  };
};

// Middleware composition
export const withAuth = (jwtService: IJwtService) => ({
  authenticate: authenticateJwt(jwtService),
  attachTokens: attachTokens(jwtService),
  statusCheck: statusCheck(jwtService),
});
