import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type {
  TAddIngredientDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import { IngredientNotFoundError } from '@/core/application/types/errors/ingredient-error';
import type { Request, Response } from 'express';

export class IngredientController {
  constructor(private ingredientService: IIngredientService) {}

  createIngredient = async (req: Request, res: Response): Promise<void> => {
    try {
      const ingredientData = req.body as TAddIngredientDto;
      const result = await this.ingredientService.addIngredient(ingredientData);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.error.message,
          },
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  };

  getIngredientById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.ingredientService.getIngredientById(id);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: {
            message: result.error.message,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  };

  getIngredientByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.query;

      if (typeof name !== 'string') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Name parameter is required and must be a string',
          },
        });
        return;
      }

      const result = await this.ingredientService.getIngredientByName(name);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: {
            message: result.error.message,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  };

  getIngredientsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.query;

      if (typeof category !== 'string') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Category parameter is required and must be a string',
          },
        });
        return;
      }

      const result = await this.ingredientService.getIngredientsByCategory(category);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: {
            message: result.error.message,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  };

  updateIngredient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as TUpdateIngredientDto;

      const result = await this.ingredientService.updateIngredient(id, updateData);

      if (!result.success) {
        const statusCode = result.error instanceof IngredientNotFoundError ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          error: {
            message: result.error.message,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  };
}
