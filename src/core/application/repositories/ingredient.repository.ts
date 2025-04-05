import type { Ingredient } from '@/core/domain/inventory/ingredient.entity';

export abstract class IIngredientRepository {
  abstract findById(id: string): Promise<Ingredient | null>;
  abstract findByName(name: string): Promise<Ingredient | null>;
  abstract findByCategory(category: string): Promise<Ingredient[]>;
  abstract findAll(): Promise<Ingredient[]>;
  abstract create(
    ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Ingredient>;
  abstract update(
    id: string,
    data: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Ingredient>;
}
