import { InventoryWriteController } from '@/controllers/inventory/inventory-write-controller';
import type { IInventoryWriteService } from '@/core/application/services/inventory-write.service';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { InventoryNotFoundError } from '@/core/application/types/errors/inventory-error';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';
import type { NextFunction, Response } from 'express';

describe('InventoryWriteController', () => {
  let controller: InventoryWriteController;
  let mockInventoryService: jest.Mocked<IInventoryWriteService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockInventoryService = {
      createInventoryWithIngredientId: jest.fn(),
      createInventoryWithNewIngredient: jest.fn(),
      deleteInventory: jest.fn(),
    };
    controller = new InventoryWriteController(mockInventoryService);
    mockRequest = {
      user: { id: 'mock-user-id' },
      body: {},
    };
    mockResponse = {
      locals: {
        data: {},
        status: 200,
      },
    };
    mockNext = jest.fn();
  });

  describe('createInventoryWithIngredientId', () => {
    it('should create an inventory with an existing ingredient', async () => {
      const createdAt = new Date();
      const updatedAt = new Date();
      const mockInventory: Inventory = {
        id: 'mock-inventory-id',
        quantity: 10,
        unit: 'kg',
        ingredient: {
          id: 'mock-ingredient-id',
          name: 'mock-ingredient-name',
          category: 'mock-category',
          createdAt,
          updatedAt,
        },
        createdAt,
        updatedAt,
        userId: 'mock-user-id',
      };

      mockInventoryService.createInventoryWithIngredientId.mockResolvedValue({
        success: true,
        data: mockInventory,
      });

      const result = await controller.createInventoryWithIngredientId(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext as NextFunction,
      );
      expect(result).not.toBeDefined();
      expect(mockResponse.locals?.data).toEqual({
        id: 'mock-inventory-id',
        quantity: 10,
        unit: 'kg',
        ingredient: {
          id: 'mock-ingredient-id',
          name: 'mock-ingredient-name',
          category: 'mock-category',
          createdAt,
          updatedAt,
        },
        createdAt,
        updatedAt,
        userId: 'mock-user-id',
      });
      expect(mockResponse.locals?.status).toBe(201);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('createInventoryWithNewIngredient', () => {
    it('should create an inventory with a new ingredient', async () => {
      const createdAt = new Date();
      const updatedAt = new Date();
      const mockInventory: Inventory = {
        id: 'mock-inventory-id',
        quantity: 10,
        unit: 'kg',
        ingredient: {
          id: 'mock-ingredient-id',
          name: 'mock-ingredient-name',
          category: 'mock-category',
          createdAt,
          updatedAt,
        },
        createdAt,
        updatedAt,
        userId: 'mock-user-id',
      };

      mockInventoryService.createInventoryWithNewIngredient.mockResolvedValue({
        success: true,
        data: mockInventory,
      });

      const result = await controller.createInventoryWithNewIngredient(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext as NextFunction,
      );
      expect(result).not.toBeDefined();
      expect(mockResponse.locals?.data).toEqual(mockInventory);
      expect(mockResponse.locals?.status).toBe(201);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('deleteInventory', () => {
    it('should delete an inventory', async () => {
      mockInventoryService.deleteInventory.mockResolvedValue({ success: true, data: undefined });
      const result = await controller.deleteInventory(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext as NextFunction,
      );
      expect(result).not.toBeDefined();
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail if inventory is not found', async () => {
      mockInventoryService.deleteInventory.mockResolvedValue({
        success: false,
        error: new InventoryNotFoundError({ message: 'Inventory not found' }),
      });
      const result = await controller.deleteInventory(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext as NextFunction,
      );
      expect(result).not.toBeDefined();
      expect(mockResponse.locals?.status).toBe(404);
      expect(mockNext).toHaveBeenCalledWith(
        new InventoryNotFoundError({ message: 'Inventory not found' }),
      );
    });
  });
});
