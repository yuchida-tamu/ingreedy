import type { IInventoryRepository } from '@/core/application/repositories/inventory.repository';
import type { AuthenticatedRequest } from '@/core/application/types/api/request';
import { InventoryNotFoundError } from '@/core/application/types/errors/inventory-error';
import { InventoryReadService } from '@/services/inventory/inventory-read-service';
import type { NextFunction, Response } from 'express';
import { InventoryReadController } from '../inventory/inventory-read-controller';

describe('InventoryReadController', () => {
  let inventoryReadController: InventoryReadController;
  let mockInventoryRepository: jest.Mocked<IInventoryRepository>;
  let inventoryReadService: InventoryReadService;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

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
    inventoryReadController = new InventoryReadController(inventoryReadService);
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
        ingredient: mockIngredient,
        quantity: 10,
        unit: 'kg' as const,
        userId: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockInventoryRepository.findById.mockResolvedValue(mockInventory);
      mockRequest.params = { id: '1' };
      await inventoryReadController.getInventoryById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.locals?.data).toEqual(mockInventory);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
    it('should call next with error when inventory is not found', async () => {
      mockInventoryRepository.findById.mockResolvedValue(null);
      mockRequest.params = { id: '1' };
      await inventoryReadController.getInventoryById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findById).toHaveBeenCalledWith('1');
      expect(mockNext).toHaveBeenCalledWith(expect.any(InventoryNotFoundError));
    });
  });

  describe('getInventoryByName', () => {
    it('should return inventory when found', async () => {
      const mockInventory = {
        id: '1',
        ingredient: mockIngredient,
        quantity: 10,
        unit: 'kg' as const,
        userId: 'mock-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockInventoryRepository.findInventoryByName.mockResolvedValue(mockInventory);
      mockRequest.query = { name: 'Flour' };
      await inventoryReadController.getInventoryByName(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findInventoryByName).toHaveBeenCalledWith(
        'mock-user-id',
        'Flour',
      );
      expect(mockResponse.locals?.data).toEqual(mockInventory);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
    it('should call next with error when inventory is not found', async () => {
      mockInventoryRepository.findInventoryByName.mockResolvedValue(null);
      mockRequest.query = { name: 'Flour' };
      await inventoryReadController.getInventoryByName(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findInventoryByName).toHaveBeenCalledWith(
        'mock-user-id',
        'Flour',
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(InventoryNotFoundError));
    });
  });

  describe('getInventoryByCategory', () => {
    it('should return inventories when found', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredient: mockIngredient,
          quantity: 10,
          unit: 'kg' as const,
          userId: 'mock-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockInventoryRepository.findInventoryByCategory.mockResolvedValue(mockInventories);
      mockRequest.query = { category: 'Baking' };
      await inventoryReadController.getInventoryByCategory(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findInventoryByCategory).toHaveBeenCalledWith(
        'mock-user-id',
        'Baking',
      );
      expect(mockResponse.locals?.data).toEqual(mockInventories);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
    it('should return empty array when no inventories are found', async () => {
      mockInventoryRepository.findInventoryByCategory.mockResolvedValue([]);
      mockRequest.query = { category: 'Baking' };
      await inventoryReadController.getInventoryByCategory(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findInventoryByCategory).toHaveBeenCalledWith(
        'mock-user-id',
        'Baking',
      );
      expect(mockResponse.locals?.data).toEqual([]);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('getAllInventories', () => {
    it('should return all inventories', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredient: mockIngredient,
          quantity: 10,
          unit: 'kg' as const,
          userId: 'mock-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockInventoryRepository.findAll.mockResolvedValue(mockInventories);
      await inventoryReadController.getAllInventories(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findAll).toHaveBeenCalled();
      expect(mockResponse.locals?.data).toEqual(mockInventories);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('getUserInventories', () => {
    it('should return inventories for the authenticated user', async () => {
      const mockInventories = [
        {
          id: '1',
          ingredient: mockIngredient,
          quantity: 10,
          unit: 'kg' as const,
          userId: 'mock-user-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockInventoryRepository.findInventoriesByUserId.mockResolvedValue(mockInventories);
      await inventoryReadController.getUserInventories(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findInventoriesByUserId).toHaveBeenCalledWith('mock-user-id');
      expect(mockResponse.locals?.data).toEqual(mockInventories);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
    it('should return empty array if user has no inventories', async () => {
      mockInventoryRepository.findInventoriesByUserId.mockResolvedValue([]);
      await inventoryReadController.getUserInventories(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockInventoryRepository.findInventoriesByUserId).toHaveBeenCalledWith('mock-user-id');
      expect(mockResponse.locals?.data).toEqual([]);
      expect(mockResponse.locals?.status).toBe(200);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
