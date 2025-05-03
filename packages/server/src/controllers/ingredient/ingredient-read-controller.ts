import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type { NextFunction, Request, Response } from 'express';

export class IngredientReadController {
  constructor(private ingredientService: IIngredientService) {}

  getIngredientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.ingredientService.getIngredientById(id);
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

  getIngredientByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name } = req.query;
      if (typeof name !== 'string') {
        next(new Error('Name parameter is required and must be a string'));
        return;
      }
      const result = await this.ingredientService.getIngredientByName(name);
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

  getIngredientsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { category } = req.query;
      if (typeof category !== 'string') {
        next(new Error('Category parameter is required and must be a string'));
        return;
      }
      const result = await this.ingredientService.getIngredientsByCategory(category);
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

  getAllIngredients = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.ingredientService.getAllIngredients();
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
