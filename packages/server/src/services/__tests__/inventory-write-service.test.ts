import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import type { IInventoryRepository } from '@/core/application/repositories/inventory.repository';
import {
  InventoryDeletionError,
  InventoryNotFoundError,
  InventoryOwnershipError,
} from '@/core/application/types/errors/inventory-error';
import type { Ingredient } from '@/core/domain/inventory/ingredient.entity';
import type { Inventory, InventoryUnit } from '@/core/domain/inventory/inventory.entity';
import { InventoryWriteService } from '@/services/inventory/inventory-write-service';

const mockIngredient: Ingredient = {
  id: '123',
  name: 'Test Ingredient',
  category: 'Test Category',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockInventory: Inventory = {
  id: '123',
  ingredient: {
    id: '123',
    name: 'Test Ingredient',
    category: 'Test Category',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  quantity: 10,
  unit: 'kg' as InventoryUnit,
  userId: '123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('InventoryWriteService', () => {
  let inventoryWriteService: InventoryWriteService;
  let mockInventoryRepository: jest.Mocked<IInventoryRepository>;
  let mockIngredientRepository: jest.Mocked<IIngredientRepository>;

  beforeEach(() => {
    mockInventoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findInventoryByCategory: jest.fn(),
      findInventoriesByUserId: jest.fn(),
      findAll: jest.fn(),
      findInventoryByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockIngredientRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findByCategory: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    inventoryWriteService = new InventoryWriteService(
      mockInventoryRepository,
      mockIngredientRepository,
    );
  });

  describe('createInventory', () => {
    it('should create an inventory with an existing ingredient', async () => {
      mockIngredientRepository.findById.mockResolvedValue(mockIngredient);
      mockInventoryRepository.create.mockResolvedValue(mockInventory);
      const inventory = await inventoryWriteService.createInventoryWithIngredientId('123', {
        ingredientId: '123',
        quantity: 10,
        unit: 'kg' as InventoryUnit,
      });
      expect(inventory.success).toBe(true);
      if (inventory.success) {
        expect(inventory.data).toEqual(mockInventory);
      }
    });

    it('should fail if ingredient is not found', async () => {
      mockIngredientRepository.findById.mockResolvedValue(null);
      const inventory = await inventoryWriteService.createInventoryWithIngredientId('123', {
        ingredientId: '123',
        quantity: 10,
        unit: 'kg' as InventoryUnit,
      });
      expect(inventory.success).toBe(false);
    });

    it('should create an inventory with a new ingredient', async () => {
      mockIngredientRepository.create.mockResolvedValue(mockIngredient);
      mockInventoryRepository.create.mockResolvedValue(mockInventory);
      const inventory = await inventoryWriteService.createInventoryWithNewIngredient('123', {
        ingredient: {
          name: 'Test Ingredient',
          category: 'Test Category',
        },
        quantity: 10,
        unit: 'kg' as InventoryUnit,
      });
      expect(inventory.success).toBe(true);
      if (inventory.success) {
        expect(inventory.data).toEqual(mockInventory);
      }
    });

    it('should not fail if ingredient with same name already exists', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);
      mockIngredientRepository.create.mockResolvedValue(mockIngredient);
      mockInventoryRepository.create.mockResolvedValue(mockInventory);
      const inventory = await inventoryWriteService.createInventoryWithNewIngredient('123', {
        ingredient: {
          name: 'Test Ingredient',
          category: 'Test Category',
        },
        quantity: 10,
        unit: 'kg' as InventoryUnit,
      });
      expect(inventory.success).toBe(true);
    });
  });

  describe('deleteInventory', () => {
    it('should delete an inventory', async () => {
      mockInventoryRepository.findById.mockResolvedValue(mockInventory);
      mockInventoryRepository.delete.mockResolvedValue(true);
      const result = await inventoryWriteService.deleteInventory('123', '123');
      expect(result.success).toBe(true);
    });

    it('should fail if inventory does not belong to user', async () => {
      mockInventoryRepository.findById.mockResolvedValue(mockInventory);
      const userId = '124';
      const inventoryId = '123';
      const result = await inventoryWriteService.deleteInventory(userId, inventoryId);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(InventoryOwnershipError);
      }
    });

    it('should fail if inventory is not found', async () => {
      mockInventoryRepository.findById.mockResolvedValue(null);
      const result = await inventoryWriteService.deleteInventory('123', '123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(InventoryNotFoundError);
      }
    });

    it('should fail if inventory is not deleted', async () => {
      mockInventoryRepository.findById.mockResolvedValue(mockInventory);
      mockInventoryRepository.delete.mockResolvedValue(false);
      const result = await inventoryWriteService.deleteInventory('123', '123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(InventoryDeletionError);
      }
    });
  });
});
