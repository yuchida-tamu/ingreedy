import type { NextFunction, Request, Response } from 'express';
import type { IAuthService } from '../../core/application/services/auth.service';

export class AuthController {
  constructor(private authService: IAuthService) {}

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
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.locals.status = 200;
    res.locals.data = {
      status: 1,
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

    res.clearCookie('accessToken', {
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
