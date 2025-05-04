import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type {
  TAddIngredientDto,
  TIngredientDto,
  TIngredientListDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import {
  IngredientAlreadyExistsError,
  IngredientNotFoundError,
} from '@/core/application/types/errors/ingredient-error';
import type { TResult } from '@/core/application/types/result';
import { ResultUtil } from '@/utils/result.util';

export class IngredientWriteService implements IIngredientService {
  constructor(private ingredientRepository: IIngredientRepository) {}

  async addIngredient(data: TAddIngredientDto): Promise<TResult<TIngredientDto>> {
    const existingIngredient = await this.ingredientRepository.findByName(data.name);
    if (existingIngredient) {
      return ResultUtil.fail(
        new IngredientAlreadyExistsError({
          message: `Ingredient with name ${data.name} already exists`,
        }),
      );
    }
    const newIngredient = await this.ingredientRepository.create(data);
    return ResultUtil.success(this.mapToIngredientDto(newIngredient));
  }

  async updateIngredient(id: string, data: TUpdateIngredientDto): Promise<TResult<TIngredientDto>> {
    const existingIngredient = await this.ingredientRepository.findById(id);
    if (!existingIngredient) {
      return ResultUtil.fail(
        new IngredientNotFoundError({
          message: `Ingredient with id ${id} not found`,
        }),
      );
    }
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
    const updatedIngredient = await this.ingredientRepository.update(id, data);
    return ResultUtil.success(this.mapToIngredientDto(updatedIngredient));
  }

  async getIngredientById(): Promise<TResult<TIngredientDto>> {
    throw new Error('getIngredientById not implemented in IngredientWriteService');
  }

  async getIngredientByName(): Promise<TResult<TIngredientDto>> {
    throw new Error('getIngredientByName not implemented in IngredientWriteService');
  }

  async getIngredientsByCategory(): Promise<TResult<TIngredientListDto>> {
    throw new Error('getIngredientsByCategory not implemented in IngredientWriteService');
  }

  async getAllIngredients(): Promise<TResult<TIngredientListDto>> {
    throw new Error('getAllIngredients not implemented in IngredientWriteService');
  }

  async checkIngredientExists(): Promise<TResult<boolean>> {
    throw new Error('checkIngredientExists not implemented in IngredientWriteService');
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
