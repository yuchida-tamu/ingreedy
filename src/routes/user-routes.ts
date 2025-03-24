import { UserController } from '@/controllers/user-controller';
import { UserService } from '@/services/user/user-service';
import { Router } from 'express';

export function generateUserRouter(): Router {
  const router = Router();
  const userService = new UserService();
  const userController = new UserController(userService);

  router.post('/create', (req, res) => userController.createUser(req, res));

  return router;
}
