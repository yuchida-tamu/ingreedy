import { IngredientController } from '@/controllers/ingredient-controller';
import { PostgresIngredientRepository } from '@/infrastructure/repositories/ingredient/postgres-ingredient-repository';
import { IngredientService } from '@/services/ingredient/ingredient-service';
import { Router } from 'express';

export function generateIngredientRouter(): Router {
  const router = Router();

  const ingredientRepository = new PostgresIngredientRepository();
  const ingredientService = new IngredientService(ingredientRepository);
  const ingredientController = new IngredientController(ingredientService);

  router.get('/getIngredientById/:id', ingredientController.getIngredientById);
  router.get('/getIngredientsByCategory', ingredientController.getIngredientsByCategory);
  router.get('/getIngredientByName', ingredientController.getIngredientByName);
  router.post('/createIngredient', ingredientController.createIngredient);
  router.put('/updateIngredient/:id', ingredientController.updateIngredient);

  return router;
}
