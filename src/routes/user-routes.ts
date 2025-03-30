import { UserController } from '@/controllers/user-controller';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { newUserDtoSchema } from '@/core/application/types/dtos/user.dto';
import { PostgresUserRepository } from '@/infrastructure/repositories/user/postgres-user-repository';
import { authenticateJwt } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validation.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { UserService } from '@/services/user/user-service';
import { Router } from 'express';

export function generateUserRouter(): Router {
  const router = Router();
  const userRepository = new PostgresUserRepository();
  const jwtService = new JwtService();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService, jwtService);

  router.post('/register', validateRequest(newUserDtoSchema), (req, res, next) =>
    userController.createUser(req, res, next),
  );
  router.get('/getUser', authenticateJwt(jwtService), (req, res, next) =>
    userController.getUser(req as AuthenticatedRequest, res, next),
  );

  return router;
}
