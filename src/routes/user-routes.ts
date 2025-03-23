import { UserController } from '@/controllers/user-controller';
import { UserService } from '@/services/user-service';
import { Router } from 'express';

export function createUserRouter(): Router {
  const router = Router();
  const userService = new UserService();
  const userController = new UserController(userService);

  router.post('/', (req, res) => userController.createUser(req, res));

  return router;
}
