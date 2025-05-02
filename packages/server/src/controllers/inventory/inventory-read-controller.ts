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
    try {
      const { id } = req.params;
      const result = await this.inventoryService.getInventoryById(id);

      if (!result.success) {
        next(result.error);
        return;
      }

      res.locals.data = result.data;
      res.locals.status = 200;
      next();
    } catch (error) {
      next(error);
    }
  };

  getInventoryByName = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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
    } catch (error) {
      next(error);
    }
  };

  getInventoryByCategory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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
    } catch (error) {
      next(error);
    }
  };

  getAllInventories = async (
    _: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.inventoryService.getAllInventories();

      if (!result.success) {
        next(result.error);
        return;
      }

      res.locals.data = result.data;
      res.locals.status = 200;
      next();
    } catch (error) {
      next(error);
    }
  };

  getUserInventories = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log('getUserInventories');
      const userId = req.user.id;
      const result = await this.inventoryService.getInventoriesByUserId(userId);

      if (!result.success) {
        next(result.error);
        return;
      }

      res.locals.data = result.data;
      res.locals.status = 200;
      next();
    } catch (error) {
      next(error);
    }
  };
}
