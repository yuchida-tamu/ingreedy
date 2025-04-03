import type {
  TAddIngredientDto,
  TIngredientDto,
  TIngredientListDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import type { TResult } from '@/core/application/types/result';

export abstract class IIngredientService {
  /**
   * Add a new ingredient
   */
  abstract addIngredient(data: TAddIngredientDto): Promise<TResult<TIngredientDto>>;

  /**
   * Get an ingredient by its ID
   */
  abstract getIngredientById(id: string): Promise<TResult<TIngredientDto>>;

  /**
   * Get an ingredient by its name
   */
  abstract getIngredientByName(name: string): Promise<TResult<TIngredientDto>>;

  /**
   * Get ingredients by category
   */
  abstract getIngredientsByCategory(category: string): Promise<TResult<TIngredientListDto>>;

  /**
   * Update an existing ingredient's details
   */
  abstract updateIngredient(
    id: string,
    data: TUpdateIngredientDto,
  ): Promise<TResult<TIngredientDto>>;

  /**
   * Check if ingredient exists by name
   */
  abstract checkIngredientExists(name: string): Promise<TResult<boolean>>;
}
