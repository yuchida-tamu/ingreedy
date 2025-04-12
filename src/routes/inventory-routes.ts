import { InventoryController } from '@/controllers/inventory/inventory-controller';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { PostgresInventoryRepository } from '@/infrastructure/repositories/inventory/postgres-inventory-repository';
import { withAuth } from '@/middlewares/auth.middleware';
import { JwtService } from '@/services/auth/jwt-service';
import { InventoryService } from '@/services/inventory/inventory-service';
import { Router } from 'express';

export function generateInventoryRouter(): Router {
  const router = Router();

  const inventoryRepository = new PostgresInventoryRepository();
  const inventoryService = new InventoryService(inventoryRepository);
  const inventoryController = new InventoryController(inventoryService);
  const jwtService = new JwtService();

  const auth = withAuth(jwtService);

  router.get('/getInventoryById/:id', auth.authenticate, (req, res, next) =>
    inventoryController.getInventoryById(req as AuthenticatedRequest, res, next),
  );

  router.get('/getInventoryByName', auth.authenticate, (req, res, next) =>
    inventoryController.getInventoryByName(req as AuthenticatedRequest, res, next),
  );

  router.get('/getInventoryByCategory', auth.authenticate, (req, res, next) =>
    inventoryController.getInventoryByCategory(req as AuthenticatedRequest, res, next),
  );

  router.get('/getAllInventories', auth.authenticate, (req, res, next) =>
    inventoryController.getAllInventories(req as AuthenticatedRequest, res, next),
  );

  return router;
}
