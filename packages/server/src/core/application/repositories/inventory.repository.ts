import type { Inventory } from '@/core/domain/inventory/inventory.entity';

export abstract class IInventoryRepository {
  abstract findById(id: string): Promise<Inventory | null>;
  abstract findInventoryByName(userId: string, name: string): Promise<Inventory | null>;
  abstract findInventoryByCategory(userId: string, category: string): Promise<Inventory[]>;
  abstract findAll(): Promise<Inventory[]>;
  abstract create(
    inventory: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt' | 'ingredient'>,
    ingredientId: string,
  ): Promise<Inventory | null>;
  abstract update(
    id: string,
    data: Partial<Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Inventory | null>;
  abstract findInventoriesByUserId(userId: string): Promise<Inventory[]>;
  abstract delete(id: string): Promise<void>;
}
