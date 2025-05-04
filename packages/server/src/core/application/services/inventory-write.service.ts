import type {
  TCreateInventoryWithIngredientIdDto,
  TCreateInventoryWithNewIngredientDto,
} from '@/core/application/types/dtos/inventory.dto';
import type { TResult } from '@/core/application/types/result';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';

export abstract class IInventoryWriteService {
  abstract createInventoryWithIngredientId(
    userId: string,
    data: TCreateInventoryWithIngredientIdDto,
  ): Promise<TResult<Inventory>>;

  abstract createInventoryWithNewIngredient(
    userId: string,
    data: TCreateInventoryWithNewIngredientDto,
  ): Promise<TResult<Inventory>>;
}
