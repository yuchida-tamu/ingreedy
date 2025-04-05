import { IngredientController } from '@/controllers/ingredient-controller';
import { PostgresIngredientRepository } from '@/infrastructure/repositories/ingredient/postgres-ingredient-repository';
import { withAuth } from '@/middleware/auth.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { IngredientService } from '@/services/ingredient/ingredient-service';
import { Router } from 'express';

export function generateIngredientRouter(): Router {
  const router = Router();

  const ingredientRepository = new PostgresIngredientRepository();
  const ingredientService = new IngredientService(ingredientRepository);
  const ingredientController = new IngredientController(ingredientService);
  const jwtService = new JwtService();

  const auth = withAuth(jwtService);

  router.get('/getIngredients', (req, res, next) =>
    ingredientController.getAllIngredients(req, res, next),
  );

  router.get('/getIngredientById/:id', auth.authenticate, (req, res, next) =>
    ingredientController.getIngredientById(req, res, next),
  );

  router.get('/getIngredientsByCategory', auth.authenticate, (req, res, next) =>
    ingredientController.getIngredientsByCategory(req, res, next),
  );

  router.get('/getIngredientByName', auth.authenticate, (req, res, next) =>
    ingredientController.getIngredientByName(req, res, next),
  );

  router.post('/createIngredient', auth.authenticate, (req, res, next) =>
    ingredientController.createIngredient(req, res, next),
  );

  router.put('/updateIngredient/:id', auth.authenticate, (req, res, next) =>
    ingredientController.updateIngredient(req, res, next),
  );

  return router;
}
