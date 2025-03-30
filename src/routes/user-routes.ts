import { UserController } from '@/controllers/user-controller';
import { newUserDtoSchema } from '@/core/application/types/dtos/user.dto';
import { PostgresUserRepository } from '@/infrastructure/repositories/user/postgres-user-repository';
import { validateRequest } from '@/middleware/validation.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { UserService } from '@/services/user/user-service';
import { Router } from 'express';
import { z } from 'zod';

// Schema for validating user ID
const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export function generateUserRouter(): Router {
  const router = Router();
  const userRepository = new PostgresUserRepository();
  const jwtService = new JwtService();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService, jwtService);

  router.post('/register', validateRequest(newUserDtoSchema), (req, res, next) =>
    userController.createUser(req, res, next),
  );
  router.get('/', validateRequest(userIdSchema, 'query'), (req, res, next) =>
    userController.getUser(req, res, next),
  );

  return router;
}
