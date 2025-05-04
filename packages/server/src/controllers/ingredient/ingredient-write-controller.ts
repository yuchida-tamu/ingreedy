import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type { NextFunction, Request, Response } from 'express';

export class IngredientWriteController {
  constructor(private ingredientService: IIngredientService) {}

  createIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ingredientData = req.body;
    const result = await this.ingredientService.addIngredient(ingredientData);
    if (!result.success) {
      next(result.error);
      return;
    }
    res.locals.data = result.data;
    res.locals.status = 201;
    next();
  };

  updateIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await this.ingredientService.updateIngredient(id, updateData);
    if (!result.success) {
      next(result.error);
      return;
    }
    res.locals.data = result.data;
    res.locals.status = 200;
    next();
  };
}
