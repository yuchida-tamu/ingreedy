import { IngredientController } from '@/controllers/ingredient-controller';
import { PostgresIngredientRepository } from '@/infrastructure/repositories/ingredient/postgres-ingredient-repository';
import { authenticateJwt } from '@/middleware/auth.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { IngredientService } from '@/services/ingredient/ingredient-service';
import { Router } from 'express';

export function generateIngredientRouter(): Router {
  const router = Router();

  const ingredientRepository = new PostgresIngredientRepository();
  const ingredientService = new IngredientService(ingredientRepository);
  const ingredientController = new IngredientController(ingredientService);
  const jwtService = new JwtService();

  const auth = authenticateJwt(jwtService);

  router.get('/getIngredients', auth, ingredientController.getAllIngredients);
  router.get('/getIngredientById/:id', auth, ingredientController.getIngredientById);
  router.get('/getIngredientsByCategory', auth, ingredientController.getIngredientsByCategory);
  router.get('/getIngredientByName', auth, ingredientController.getIngredientByName);
  router.post('/createIngredient', auth, ingredientController.createIngredient);
  router.put('/updateIngredient/:id', auth, ingredientController.updateIngredient);

  return router;
}
