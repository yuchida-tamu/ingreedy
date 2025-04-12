import type { Inventory } from '@/core/domain/inventory/inventory.entity';

export abstract class IInventoryRepository {
  abstract findById(id: string): Promise<Inventory | null>;
  abstract findByName(name: string): Promise<Inventory | null>;
  abstract findByCategory(category: string): Promise<Inventory[]>;
  abstract findAll(): Promise<Inventory[]>;
  abstract create(inventory: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inventory>;
  abstract update(
    id: string,
    data: Partial<Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Inventory>;
}
