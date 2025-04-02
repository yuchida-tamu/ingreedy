import type { Ingredient } from '@/core/domain/inventory/ingredient.entity';

export interface IIngredientRepository {
  findById(id: string): Promise<Ingredient | null>;
  findByName(name: string): Promise<Ingredient | null>;
  findByCategory(category: string): Promise<Ingredient[]>;
  create(ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient>;
  update(
    id: string,
    data: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Ingredient>;
}
