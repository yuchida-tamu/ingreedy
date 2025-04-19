import { UserController } from '@/controllers/user/user-controller';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { newUserDtoSchema, updateUserDtoSchema } from '@/core/application/types/dtos/user.dto';
import { PostgresUserRepository } from '@/infrastructure/repositories/user/postgres-user-repository';
import { withAuth } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validation.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { UserService } from '@/services/user/user-service';
import { Router } from 'express';

export function generateUserRouter(): Router {
  const router = Router();
  const userRepository = new PostgresUserRepository();
  const jwtService = new JwtService();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const auth = withAuth(jwtService);

  const validateCreateUser = validateRequest(newUserDtoSchema);
  const validateUpdateUser = validateRequest(updateUserDtoSchema);

  router.post(
    '/createUser',
    validateCreateUser,
    (req, res, next) => userController.createUser(req, res, next),
    auth.attachTokens,
  );

  router.get('/getUser', auth.authenticate, (req, res, next) =>
    userController.getUser(req as AuthenticatedRequest, res, next),
  );

  router.put('/updateUser', auth.authenticate, validateUpdateUser, (req, res, next) =>
    userController.updateUser(req as AuthenticatedRequest, res, next),
  );

  return router;
}
