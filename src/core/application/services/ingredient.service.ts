import type {
  TAddIngredientDto,
  TIngredientDto,
  TIngredientListDto,
  TUpdateIngredientDto,
} from '@/core/application/types/dtos/ingredient.dto';
import type { TResult } from '@/core/application/types/result';

export interface IIngredientService {
  /**
   * Add a new ingredient
   */
  addIngredient(data: TAddIngredientDto): Promise<TResult<TIngredientDto>>;

  /**
   * Get an ingredient by its ID
   */
  getIngredientById(id: string): Promise<TResult<TIngredientDto>>;

  /**
   * Get an ingredient by its name
   */
  getIngredientByName(name: string): Promise<TResult<TIngredientDto>>;

  /**
   * Get ingredients by category
   */
  getIngredientsByCategory(category: string): Promise<TResult<TIngredientListDto>>;

  /**
   * Update an existing ingredient's details
   */
  updateIngredient(id: string, data: TUpdateIngredientDto): Promise<TResult<TIngredientDto>>;

  /**
   * Check if ingredient exists by name
   */
  checkIngredientExists(name: string): Promise<TResult<boolean>>;
}
