import { AuthController } from '@/controllers/auth/auth-controller';
import { PostgresUserRepository } from '@/infrastructure/repositories/user/postgres-user-repository';
import { withAuth } from '@/middlewares/auth.middleware';
import { AuthService } from '@/services/auth/auth-service';
import { JwtService } from '@/services/auth/jwt-service';
import { UserService } from '@/services/user/user-service';
import { Router } from 'express';

export function generateAuthRouter(): Router {
  const router = Router();
  const userRepository = new PostgresUserRepository();
  const jwtService = new JwtService();
  const userService = new UserService(userRepository);
  const authService = new AuthService(userService, jwtService);
  const authController = new AuthController(authService);
  const auth = withAuth(jwtService);

  router.post('/login', (req, res, next) => authController.login(req, res, next));
  router.post('/logout', (req, res, next) => authController.logout(req, res, next));
  router.get('/status', auth.authenticate, (req, res, next) =>
    authController.status(req, res, next),
  );

  return router;
}
