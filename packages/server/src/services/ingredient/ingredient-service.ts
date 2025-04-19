import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import { IIngredientService } from '@/core/application/services/ingredient.service';
import type {
  TAddIngredientDto,
  TIngredientDto,
  TIngredientListDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import {
  IngredientAlreadyExistsError,
  IngredientError,
  IngredientNotFoundError,
} from '@/core/application/types/errors/ingredient-error';
import type { TResult } from '@/core/application/types/result';
import { ResultUtil } from '@/utils/result.util';

export class IngredientService extends IIngredientService {
  constructor(private ingredientRepository: IIngredientRepository) {
    super();
  }

  async addIngredient(data: TAddIngredientDto): Promise<TResult<TIngredientDto>> {
    try {
      // Check if ingredient with name already exists
      const existingIngredient = await this.ingredientRepository.findByName(data.name);
      if (existingIngredient) {
        return ResultUtil.fail(
          new IngredientAlreadyExistsError({
            message: `Ingredient with name ${data.name} already exists`,
          }),
        );
      }

      // Create new ingredient
      const newIngredient = await this.ingredientRepository.create(data);
      return ResultUtil.success(this.mapToIngredientDto(newIngredient));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.fail(new IngredientError(message));
    }
  }

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

  async updateIngredient(id: string, data: TUpdateIngredientDto): Promise<TResult<TIngredientDto>> {
    try {
      // Check if ingredient exists
      const existingIngredient = await this.ingredientRepository.findById(id);
      if (!existingIngredient) {
        return ResultUtil.fail(
          new IngredientNotFoundError({
            message: `Ingredient with id ${id} not found`,
          }),
        );
      }

      // If name is being updated, check if it's already taken
      if (data.name && data.name !== existingIngredient.name) {
        const ingredientWithName = await this.ingredientRepository.findByName(data.name);
        if (ingredientWithName) {
          return ResultUtil.fail(
            new IngredientAlreadyExistsError({
              message: `Ingredient with name ${data.name} already exists`,
            }),
          );
        }
      }

      // Update ingredient
      const updatedIngredient = await this.ingredientRepository.update(id, data);
      return ResultUtil.success(this.mapToIngredientDto(updatedIngredient));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return ResultUtil.fail(new IngredientError(message));
    }
  }

  async checkIngredientExists(name: string): Promise<TResult<boolean>> {
    try {
      const ingredient = await this.ingredientRepository.findByName(name);
      return ResultUtil.success(!!ingredient);
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
