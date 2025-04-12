import type { IInventoryService } from '@/core/application/services/inventory.service';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { InventoryNotFoundError } from '@/core/application/types/errors/inventory-error';
import type { NextFunction, Response } from 'express';
import { InventoryController } from '../inventory/inventory-controller';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let mockInventoryService: jest.Mocked<IInventoryService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockInventoryService = {
      getInventoryById: jest.fn(),
      getInventoryByName: jest.fn(),
      getInventoryByCategory: jest.fn(),
      getAllInventories: jest.fn(),
    };

    inventoryController = new InventoryController(mockInventoryService);

    mockRequest = {
      user: { id: 'mock-user-id' },
      params: {},
      query: {},
    };

    mockResponse = {
      locals: {},
    };

    mockNext = jest.fn();
  });

  describe('getInventoryById', () => {
    it('should return inventory when found', async () => {
      const mockInventory = {
        id: '1',
        ingredientId: 'ingredient-1',
        quantity: 10,
        unit: 'kg',
        userId: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as const;
      mockInventoryService.getInventoryById.mockResolvedValue({
        success: true,
        data: mockInventory,
      });

      mockRequest.params = { id: '1' };

      await inventoryController.getInventoryById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getInventoryById).toHaveBeenCalledWith('1');
      expect(mockResponse.locals?.data).toEqual(mockInventory);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with error when inventory is not found', async () => {
      const mockError = new InventoryNotFoundError({ message: 'Not found' });
      mockInventoryService.getInventoryById.mockResolvedValue({ success: false, error: mockError });

      mockRequest.params = { id: '1' };

      await inventoryController.getInventoryById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getInventoryById).toHaveBeenCalledWith('1');
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getInventoryByName', () => {
    it('should return inventory when found', async () => {
      const mockInventory = {
        id: '1',
        name: 'item1',
        ingredientId: 'ingredient-1',
        quantity: 10,
        unit: 'kg',
        userId: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as const;
      mockInventoryService.getInventoryByName.mockResolvedValue({
        success: true,
        data: mockInventory,
      });

      mockRequest.query = { name: 'item1' };

      await inventoryController.getInventoryByName(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getInventoryByName).toHaveBeenCalledWith('mock-user-id', 'item1');
      expect(mockResponse.locals?.data).toEqual(mockInventory);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with error when inventory is not found', async () => {
      const mockError = new InventoryNotFoundError({ message: 'Not found' });
      mockInventoryService.getInventoryByName.mockResolvedValue({
        success: false,
        error: mockError,
      });

      mockRequest.query = { name: 'item1' };

      await inventoryController.getInventoryByName(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getInventoryByName).toHaveBeenCalledWith('mock-user-id', 'item1');
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getInventoryByCategory', () => {
    it('should return inventories when found', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredientId: 'ingredient-1',
          quantity: 10,
          unit: 'kg',
          userId: 'mock-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as const,
      ];
      mockInventoryService.getInventoryByCategory.mockResolvedValue({
        success: true,
        data: mockInventories,
      });

      mockRequest.query = { category: 'category1' };

      await inventoryController.getInventoryByCategory(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getInventoryByCategory).toHaveBeenCalledWith(
        'mock-user-id',
        'category1',
      );
      expect(mockResponse.locals?.data).toEqual(mockInventories);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with error when inventory is not found', async () => {
      const mockError = new InventoryNotFoundError({ message: 'Not found' });
      mockInventoryService.getInventoryByCategory.mockResolvedValue({
        success: false,
        error: mockError,
      });

      mockRequest.query = { category: 'category1' };

      await inventoryController.getInventoryByCategory(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getInventoryByCategory).toHaveBeenCalledWith(
        'mock-user-id',
        'category1',
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllInventories', () => {
    it('should return all inventories', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredientId: 'ingredient-1',
          quantity: 10,
          unit: 'kg',
          userId: 'mock-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as const,
      ];
      mockInventoryService.getAllInventories.mockResolvedValue({
        success: true,
        data: mockInventories,
      });

      await inventoryController.getAllInventories(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getAllInventories).toHaveBeenCalled();
      expect(mockResponse.locals?.data).toEqual(mockInventories);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with error when an error occurs', async () => {
      const mockError = new Error('Unexpected error');
      mockInventoryService.getAllInventories.mockRejectedValue(mockError);

      await inventoryController.getAllInventories(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockInventoryService.getAllInventories).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
