import type {
  TAddIngredientDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import type { IngredientWriteService } from '@/services/ingredient/ingredient-write-service';
import type { NextFunction, Request, Response } from 'express';

export class IngredientWriteController {
  constructor(private ingredientWriteService: IngredientWriteService) {}

  createIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ingredientData = req.body as TAddIngredientDto;
      const result = await this.ingredientWriteService.addIngredient(ingredientData);
      if (!result.success) {
        next(result.error);
        return;
      }
      res.locals.data = result.data;
      res.locals.status = 201;
      next();
    } catch (error) {
      next(error);
    }
  };

  updateIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as TUpdateIngredientDto;
      const result = await this.ingredientWriteService.updateIngredient(id, updateData);
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
