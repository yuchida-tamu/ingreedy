import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import type {
  TIngredientDto,
  TIngredientListDto,
} from '@/core/application/types/dtos/ingredient.dto';
import {
  IngredientError,
  IngredientNotFoundError,
} from '@/core/application/types/errors/ingredient-error';
import type { TResult } from '@/core/application/types/result';
import { ResultUtil } from '@/utils/result.util';

export class IngredientReadService {
  constructor(private ingredientRepository: IIngredientRepository) {}

  async getIngredientById(id: string): Promise<TResult<TIngredientDto>> {
    try {
      const ingredient = await this.ingredientRepository.findById(id);
      if (!ingredient) {
        return ResultUtil.fail(
          new IngredientNotFoundError({
            message: `Ingredient with id ${id} not found`,
          }),
        );
      }
      return ResultUtil.success(this.mapToIngredientDto(ingredient));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.fail(new IngredientError(message));
    }
  }

  async getIngredientByName(name: string): Promise<TResult<TIngredientDto>> {
    try {
      const ingredient = await this.ingredientRepository.findByName(name);
      if (!ingredient) {
        return ResultUtil.fail(
          new IngredientNotFoundError({
            message: `Ingredient with name ${name} not found`,
          }),
        );
      }
      return ResultUtil.success(this.mapToIngredientDto(ingredient));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.fail(new IngredientError(message));
    }
  }

  async getIngredientsByCategory(category: string): Promise<TResult<TIngredientListDto>> {
    try {
      const ingredients = await this.ingredientRepository.findByCategory(category);
      return ResultUtil.success({
        items: ingredients.map(this.mapToIngredientDto),
        total: ingredients.length,
        page: 1,
        limit: ingredients.length,
        totalPages: 1,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.fail(new IngredientError(message));
    }
  }

  async getAllIngredients(): Promise<TResult<TIngredientListDto>> {
    try {
      const ingredients = await this.ingredientRepository.findAll();
      return ResultUtil.success({
        items: ingredients.map(this.mapToIngredientDto),
        total: ingredients.length,
        page: 1,
        limit: ingredients.length,
        totalPages: 1,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.fail(new IngredientError(message));
    }
  }

  private mapToIngredientDto(ingredient: {
    id: string;
    name: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }): TIngredientDto {
    return {
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category as TIngredientDto['category'],
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
    };
  }
}
