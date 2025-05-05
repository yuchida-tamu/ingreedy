import { InventoryReadController } from '@/controllers/inventory/inventory-read-controller';
import { InventoryWriteController } from '@/controllers/inventory/inventory-write-controller';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { PostgresIngredientRepository } from '@/infrastructure/repositories/ingredient/postgres-ingredient-repository';
import { PostgresInventoryRepository } from '@/infrastructure/repositories/inventory/postgres-inventory-repository';
import { withAuth } from '@/middlewares/auth.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { InventoryReadService } from '@/services/inventory/inventory-read-service';
import { InventoryWriteService } from '@/services/inventory/inventory-write-service';
import { Router } from 'express';

export function generateInventoryRouter(): Router {
  const router = Router();

  const inventoryRepository = new PostgresInventoryRepository();
  const ingredientRepository = new PostgresIngredientRepository();
  const readService = new InventoryReadService(inventoryRepository);
  const writeService = new InventoryWriteService(inventoryRepository, ingredientRepository);
  const readController = new InventoryReadController(readService);
  const writeController = new InventoryWriteController(writeService);
  const jwtService = new JwtService();

  const auth = withAuth(jwtService);

  // Read routes
  router.get('/getInventoryById/:id', auth.authenticate, (req, res, next) =>
    readController.getInventoryById(req as AuthenticatedRequest, res, next),
  );

  router.get('/getInventoryByName', auth.authenticate, (req, res, next) =>
    readController.getInventoryByName(req as AuthenticatedRequest, res, next),
  );

  router.get('/getInventoryByCategory', auth.authenticate, (req, res, next) =>
    readController.getInventoryByCategory(req as AuthenticatedRequest, res, next),
  );

  router.get('/getAllInventories', auth.authenticate, (req, res, next) =>
    readController.getAllInventories(req as AuthenticatedRequest, res, next),
  );

  router.get('/getUserInventories', auth.authenticate, (req, res, next) =>
    readController.getUserInventories(req as AuthenticatedRequest, res, next),
  );

  // Write routes
  router.post('/createInventoryWithIngredientId', auth.authenticate, (req, res, next) =>
    writeController.createInventoryWithIngredientId(req as AuthenticatedRequest, res, next),
  );

  router.post('/createInventoryWithNewIngredient', auth.authenticate, (req, res, next) =>
    writeController.createInventoryWithNewIngredient(req as AuthenticatedRequest, res, next),
  );

  router.delete('/deleteInventory', auth.authenticate, (req, res, next) =>
    writeController.deleteInventory(req as AuthenticatedRequest, res, next),
  );

  return router;
}
