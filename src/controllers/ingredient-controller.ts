import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type {
  TAddIngredientDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import type { NextFunction, Request, Response } from 'express';

export class IngredientController {
  constructor(private ingredientService: IIngredientService) {}

  createIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ingredientData = req.body as TAddIngredientDto;
    const result = await this.ingredientService.addIngredient(ingredientData);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.status(201).json({
      success: true,
      data: result.data,
    });
  };

  getIngredientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const result = await this.ingredientService.getIngredientById(id);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
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

    res.status(200).json({
      success: true,
      data: result.data,
    });
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

    res.status(200).json({
      success: true,
      data: result.data,
    });
  };

  updateIngredient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body as TUpdateIngredientDto;

    const result = await this.ingredientService.updateIngredient(id, updateData);

    if (!result.success) {
      next(result.error);
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  };
}
