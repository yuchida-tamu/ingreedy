import type { IInventoryRepository } from '../../core/application/repositories/inventory.repository';
import { InventoryNotFoundError } from '../../core/application/types/errors/inventory-error';
import type { InventoryUnit } from '../../core/domain/inventory/inventory.entity';
import { InventoryReadService } from '../inventory/inventory-read-service';

describe('InventoryReadService', () => {
  let inventoryReadService: InventoryReadService;
  let mockInventoryRepository: jest.Mocked<IInventoryRepository>;

  const mockIngredient = {
    id: 'ingredient-1',
    name: 'Flour',
    category: 'Baking',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockInventoryRepository = {
      findById: jest.fn(),
      findInventoryByName: jest.fn(),
      findInventoryByCategory: jest.fn(),
      findInventoriesByUserId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    inventoryReadService = new InventoryReadService(mockInventoryRepository);
  });

  describe('getInventoryById', () => {
    it('should return inventory when found', async () => {
      const mockInventory = {
        id: '1',
        ingredient: mockIngredient,
        quantity: 10,
        unit: 'kg' as InventoryUnit,
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInventoryRepository.findById.mockResolvedValue(mockInventory);

      const result = await inventoryReadService.getInventoryById('1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockInventory);
      }
    });

    it('should return error when inventory is not found', async () => {
      mockInventoryRepository.findById.mockResolvedValue(null);

      const result = await inventoryReadService.getInventoryById('1');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(InventoryNotFoundError);
        expect(result.error.message).toBe('Inventory with id 1 not found');
      }
    });
  });

  describe('getInventoryByName', () => {
    it('should return inventory when found', async () => {
      const mockInventory = {
        id: '1',
        ingredient: mockIngredient,
        quantity: 10,
        unit: 'kg' as InventoryUnit,
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInventoryRepository.findInventoryByName.mockResolvedValue(mockInventory);

      const result = await inventoryReadService.getInventoryByName('user-1', 'Flour');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockInventory);
      }
    });

    it('should return error when inventory is not found', async () => {
      mockInventoryRepository.findInventoryByName.mockResolvedValue(null);

      const result = await inventoryReadService.getInventoryByName('user-1', 'Flour');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(InventoryNotFoundError);
        expect(result.error.message).toBe('Inventory with name Flour not found for user user-1');
      }
    });
  });

  describe('getInventoryByCategory', () => {
    it('should return inventories when found', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredient: mockIngredient,
          quantity: 10,
          unit: 'kg' as InventoryUnit,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockInventoryRepository.findInventoryByCategory.mockResolvedValue(mockInventories);

      const result = await inventoryReadService.getInventoryByCategory('user-1', 'Baking');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockInventories);
      }
    });

    it('should return empty array when no inventories are found', async () => {
      mockInventoryRepository.findInventoryByCategory.mockResolvedValue([]);

      const result = await inventoryReadService.getInventoryByCategory('user-1', 'Baking');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });
  });

  describe('getAllInventories', () => {
    it('should return all inventories', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredient: mockIngredient,
          quantity: 10,
          unit: 'kg' as InventoryUnit,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockInventoryRepository.findAll.mockResolvedValue(mockInventories);

      const result = await inventoryReadService.getAllInventories();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockInventories);
      }
    });
  });

  describe('getInventoriesByUserId', () => {
    it('should return inventories for the user', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredient: mockIngredient,
          quantity: 10,
          unit: 'kg' as InventoryUnit,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockInventoryRepository.findInventoriesByUserId.mockResolvedValue(mockInventories);

      const result = await inventoryReadService.getInventoriesByUserId('user-1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockInventories);
      }
    });

    it('should return empty array if user has no inventories', async () => {
      mockInventoryRepository.findInventoriesByUserId.mockResolvedValue([]);

      const result = await inventoryReadService.getInventoriesByUserId('user-1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });
  });
});
