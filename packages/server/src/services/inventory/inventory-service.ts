import type { IInventoryRepository } from '@/core/application/repositories/inventory.repository';
import type { IInventoryService } from '@/core/application/services/inventory.service';
import { InventoryNotFoundError } from '@/core/application/types/errors/inventory-error';
import type { TResult } from '@/core/application/types/result';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';
import { ResultUtil } from '@/utils/result.util';

export class InventoryService implements IInventoryService {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async getInventoryById(id: string): Promise<TResult<Inventory>> {
    const inventory = await this.inventoryRepository.findById(id);

    if (!inventory) {
      return ResultUtil.fail(
        new InventoryNotFoundError({
          message: `Inventory with id ${id} not found`,
        }),
      );
    }

    return ResultUtil.success(inventory);
  }

  async getInventoryByName(userId: string, name: string): Promise<TResult<Inventory>> {
    const inventory = await this.inventoryRepository.findInventoryByName(userId, name);

    if (!inventory) {
      return ResultUtil.fail(
        new InventoryNotFoundError({
          message: `Inventory with name ${name} not found for user ${userId}`,
        }),
      );
    }

    return ResultUtil.success(inventory);
  }

  async getInventoryByCategory(userId: string, category: string): Promise<TResult<Inventory[]>> {
    const inventories = await this.inventoryRepository.findInventoryByCategory(userId, category);

    return ResultUtil.success(inventories);
  }

  async getAllInventories(): Promise<TResult<Inventory[]>> {
    const inventories = await this.inventoryRepository.findAll();

    return ResultUtil.success(inventories);
  }

  async getInventoriesByUserId(userId: string): Promise<TResult<Inventory[]>> {
    const inventories = await this.inventoryRepository.findInventoriesByUserId(userId);
    return ResultUtil.success(inventories);
  }
}
