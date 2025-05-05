import type { IInventoryWriteService } from '@/core/application/services/inventory-write.service';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { InventoryNotFoundError } from '@/core/application/types/errors/inventory-error';
import type { NextFunction, Response } from 'express';

export class InventoryWriteController {
  constructor(private inventoryService: IInventoryWriteService) {}

  async createInventoryWithIngredientId(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { ingredientId, quantity, unit } = req.body;
    const userId = req.user.id;
    const result = await this.inventoryService.createInventoryWithIngredientId(userId, {
      ingredientId,
      quantity,
      unit,
    });
    if (result.success) {
      res.locals.data = result.data;
      res.locals.status = 201;
      next();
      return;
    }
    next(result.error);
  }

  async createInventoryWithNewIngredient(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { ingredient, quantity, unit } = req.body;
    const userId = req.user.id;
    const result = await this.inventoryService.createInventoryWithNewIngredient(userId, {
      ingredient,
      quantity,
      unit,
    });
    if (result.success) {
      res.locals.data = result.data;
      res.locals.status = 201;
      next();
      return;
    }
    next(result.error);
  }

  async deleteInventory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { id } = req.body;
    const userId = req.user.id;
    const result = await this.inventoryService.deleteInventory(userId, id);
    if (result.success) {
      res.locals.data = result.data;
      res.locals.status = 200;
      next();
      return;
    }
    if (result.error instanceof InventoryNotFoundError) {
      res.locals.status = 404;
    }
    next(result.error);
  }
}
