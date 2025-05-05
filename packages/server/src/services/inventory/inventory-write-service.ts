import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import type { IInventoryRepository } from '@/core/application/repositories/inventory.repository';
import { IInventoryWriteService } from '@/core/application/services/inventory-write.service';
import type {
  TCreateInventoryWithIngredientIdDto,
  TCreateInventoryWithNewIngredientDto,
} from '@/core/application/types/dtos/inventory.dto';
import { IngredientNotFoundError } from '@/core/application/types/errors/ingredient-error';
import {
  InventoryCreationError,
  InventoryNotFoundError,
  InventoryOwnershipError,
} from '@/core/application/types/errors/inventory-error';
import type { TResult } from '@/core/application/types/result';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';
import { ResultUtil } from '@/utils/result.util';

export class InventoryWriteService extends IInventoryWriteService {
  constructor(
    private inventoryRepository: IInventoryRepository,
    private ingredientRepository: IIngredientRepository,
  ) {
    super();
  }

  async createInventoryWithIngredientId(
    userId: string,
    data: TCreateInventoryWithIngredientIdDto,
  ): Promise<TResult<Inventory>> {
    // Check if ingredient exists
    const ingredient = await this.ingredientRepository.findById(data.ingredientId);
    if (!ingredient) {
      return ResultUtil.fail(new IngredientNotFoundError({ message: `Ingredient not found` }));
    }
    // Create inventory
    const inventory = await this.inventoryRepository.create(
      {
        quantity: data.quantity,
        unit: data.unit,
        userId,
      },
      ingredient.id,
    );
    if (!inventory) {
      return ResultUtil.fail(new InventoryCreationError({ message: 'Failed to create inventory' }));
    }
    return ResultUtil.success(inventory);
  }

  async createInventoryWithNewIngredient(
    userId: string,
    data: TCreateInventoryWithNewIngredientDto,
  ): Promise<TResult<Inventory>> {
    const ingredient = await this.ingredientRepository.create(data.ingredient);
    if (!ingredient) {
      return ResultUtil.fail(
        new InventoryCreationError({ message: 'Failed to create ingredient' }),
      );
    }
    // Create inventory
    const inventory = await this.inventoryRepository.create(
      {
        quantity: data.quantity,
        unit: data.unit,
        userId,
      },
      ingredient.id,
    );
    if (!inventory) {
      return ResultUtil.fail(new InventoryCreationError({ message: 'Failed to create inventory' }));
    }
    return ResultUtil.success(inventory);
  }

  async deleteInventory(userId: string, id: string): Promise<TResult<void>> {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) {
      return ResultUtil.fail(new InventoryNotFoundError({ message: 'Inventory not found' }));
    }
    if (inventory.userId !== userId) {
      return ResultUtil.fail(
        new InventoryOwnershipError({ message: 'Inventory does not belong to user' }),
      );
    }
    await this.inventoryRepository.delete(id);
    return ResultUtil.success(undefined);
  }
}
