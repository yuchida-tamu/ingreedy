import type { Inventory } from '@/core/domain/inventory/inventory.entity';

export abstract class IInventoryRepository {
  abstract findById(id: string): Promise<Inventory | null>;
  abstract findIngredientsByName(inventoryId: string, name: string): Promise<Inventory | null>;
  abstract findIngredientsByCategory(inventoryId: string, category: string): Promise<Inventory[]>;
  abstract findAll(): Promise<Inventory[]>;
  abstract create(inventory: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inventory | null>;
  abstract update(
    id: string,
    data: Partial<Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Inventory | null>;
}
