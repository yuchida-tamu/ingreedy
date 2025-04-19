import type { TResult } from '@/core/application/types/result';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';

export abstract class IInventoryService {
  abstract getInventoryById(id: string): Promise<TResult<Inventory>>;
  abstract getInventoryByName(userId: string, name: string): Promise<TResult<Inventory>>;
  abstract getInventoryByCategory(userId: string, category: string): Promise<TResult<Inventory[]>>;
  abstract getAllInventories(): Promise<TResult<Inventory[]>>;
}
