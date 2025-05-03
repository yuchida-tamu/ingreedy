import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type {
  TIngredientDto,
  TIngredientListDto,
} from '@/core/application/types/dtos/ingredient.dto';
import { IngredientNotFoundError } from '@/core/application/types/errors/ingredient-error';
import type { TResult } from '@/core/application/types/result';
import { ResultUtil } from '@/utils/result.util';

export class IngredientReadService implements IIngredientService {
  constructor(private ingredientRepository: IIngredientRepository) {}

  async getIngredientById(id: string): Promise<TResult<TIngredientDto>> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      return ResultUtil.fail(
        new IngredientNotFoundError({
          message: `Ingredient with id ${id} not found`,
        }),
      );
    }
    return ResultUtil.success(this.mapToIngredientDto(ingredient));
  }

  async getIngredientByName(name: string): Promise<TResult<TIngredientDto>> {
    const ingredient = await this.ingredientRepository.findByName(name);
    if (!ingredient) {
      return ResultUtil.fail(
        new IngredientNotFoundError({
          message: `Ingredient with name ${name} not found`,
        }),
      );
    }
    return ResultUtil.success(this.mapToIngredientDto(ingredient));
  }

  async getIngredientsByCategory(category: string): Promise<TResult<TIngredientListDto>> {
    const ingredients = await this.ingredientRepository.findByCategory(category);
    return ResultUtil.success({
      items: ingredients.map(this.mapToIngredientDto),
      total: ingredients.length,
      page: 1,
      limit: ingredients.length,
      totalPages: 1,
    });
  }

  async getAllIngredients(): Promise<TResult<TIngredientListDto>> {
    const ingredients = await this.ingredientRepository.findAll();
    return ResultUtil.success({
      items: ingredients.map(this.mapToIngredientDto),
      total: ingredients.length,
      page: 1,
      limit: ingredients.length,
      totalPages: 1,
    });
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

  async addIngredient(): Promise<TResult<TIngredientDto>> {
    throw new Error('addIngredient not implemented in IngredientReadService');
  }

  async updateIngredient(): Promise<TResult<TIngredientDto>> {
    throw new Error('updateIngredient not implemented in IngredientReadService');
  }

  async checkIngredientExists(): Promise<TResult<boolean>> {
    throw new Error('checkIngredientExists not implemented in IngredientReadService');
  }
}
