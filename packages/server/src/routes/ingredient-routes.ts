import { IngredientReadController } from '@/controllers/ingredient/ingredient-read-controller';
import { IngredientWriteController } from '@/controllers/ingredient/ingredient-write-controller';
import { PostgresIngredientRepository } from '@/infrastructure/repositories/ingredient/postgres-ingredient-repository';
import { withAuth } from '@/middlewares/auth.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { IngredientReadService } from '@/services/ingredient/ingredient-read-service';
import { IngredientWriteService } from '@/services/ingredient/ingredient-write-service';
import { Router } from 'express';

export function generateIngredientRouter(): Router {
  const router = Router();

  const ingredientRepository = new PostgresIngredientRepository();
  const readService = new IngredientReadService(ingredientRepository);
  const writeService = new IngredientWriteService(ingredientRepository);
  const readController = new IngredientReadController(readService);
  const writeController = new IngredientWriteController(writeService);
  const jwtService = new JwtService();

  const auth = withAuth(jwtService);

  router.get('/getIngredients', (req, res, next) =>
    readController.getAllIngredients(req, res, next),
  );

  router.get('/getIngredientById/:id', auth.authenticate, (req, res, next) =>
    readController.getIngredientById(req, res, next),
  );

  router.get('/getIngredientsByCategory', auth.authenticate, (req, res, next) =>
    readController.getIngredientsByCategory(req, res, next),
  );

  router.get('/getIngredientByName', auth.authenticate, (req, res, next) =>
    readController.getIngredientByName(req, res, next),
  );

  router.post('/createIngredient', auth.authenticate, (req, res, next) =>
    writeController.createIngredient(req, res, next),
  );

  router.put('/updateIngredient/:id', auth.authenticate, (req, res, next) =>
    writeController.updateIngredient(req, res, next),
  );

  return router;
}
