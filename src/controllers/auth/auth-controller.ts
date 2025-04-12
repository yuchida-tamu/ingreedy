import type { AuthService } from '@/services/auth/auth-service';
import type { NextFunction, Request, Response } from 'express';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);

    if (!result.success) {
      next(result.error);
      return;
    }
    const tokens = result.data;
    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        }
    );

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.locals.status = 200;
    res.locals.data = {
        message: 'Login successful',
    };      
    next();
  }

  logout(_: Request, res: Response, next: NextFunction) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    this.authService.logout();
    res.locals.status = 200;
    res.locals.data = {
        message: 'Logout successful',
    };
    next();
  }
}