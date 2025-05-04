import type { IInventoryService } from '@/core/application/services/inventory.service';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import type { NextFunction, Response } from 'express';

export class InventoryReadController {
  constructor(private inventoryService: IInventoryService) {}

  getInventoryById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    const result = await this.inventoryService.getInventoryById(id);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };

  getInventoryByName = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { name } = req.query;

    if (typeof name !== 'string') {
      next(new Error('Name parameter is required and must be a string'));
      return;
    }

    const result = await this.inventoryService.getInventoryByName(req.user.id, name);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };

  getInventoryByCategory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { category } = req.query;

    if (typeof category !== 'string') {
      next(new Error('Category parameter is required and must be a string'));
      return;
    }

    const result = await this.inventoryService.getInventoryByCategory(req.user.id, category);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };

  getAllInventories = async (
    _: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await this.inventoryService.getAllInventories();

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };

  getUserInventories = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user.id;
    const result = await this.inventoryService.getInventoriesByUserId(userId);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };
}
