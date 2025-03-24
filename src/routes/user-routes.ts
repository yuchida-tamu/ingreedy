import { UserController } from '@/controllers/user-controller';
import { validateRequest } from '@/middleware/validation.middleware';
import { UserService } from '@/services/user/user-service';
import { newUserDtoSchema } from '@/types/dtos/user.dto';
import { Router } from 'express';
import { z } from 'zod';

// Schema for validating user ID
const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export function generateUserRouter(): Router {
  const router = Router();
  const userService = new UserService();
  const userController = new UserController(userService);

  router.post('/new', validateRequest(newUserDtoSchema), (req, res) =>
    userController.createUser(req, res),
  );
  router.get('/', validateRequest(userIdSchema, 'query'), (req, res) =>
    userController.getUser(req, res),
  );

  return router;
}
