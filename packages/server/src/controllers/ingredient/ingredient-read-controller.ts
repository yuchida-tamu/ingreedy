import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type { NextFunction, Request, Response } from 'express';

export class IngredientReadController {
  constructor(private ingredientService: IIngredientService) {}

  getIngredientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const result = await this.ingredientService.getIngredientById(id);
    if (!result.success) {
      next(result.error);
      return;
    }
    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };

  getIngredientByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  };

  getIngredientsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
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
  };

  getAllIngredients = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.ingredientService.getAllIngredients();
    if (!result.success) {
      next(result.error);
      return;
    }
    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };
}
