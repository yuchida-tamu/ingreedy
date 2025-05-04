import type { IIngredientService } from '@/core/application/services/ingredient.service';
import type { NextFunction, Request, Response } from 'express';
import type {
  TIngredientDto,
  TIngredientListDto,
} from '../../core/application/types/dtos/ingredient.dto';
import {
  IngredientError,
  IngredientNotFoundError,
} from '../../core/application/types/errors/ingredient-error';
import { ResultUtil } from '../../utils/result.util';
import { IngredientReadController } from '../ingredient/ingredient-read-controller';

describe('IngredientReadController', () => {
  let ingredientReadController: IngredientReadController;
  let mockIngredientReadService: jest.Mocked<IIngredientService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const mockIngredient: TIngredientDto = {
    id: '123',
    name: 'Test Ingredient',
    category: 'vegetable',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockNext = jest.fn();
    mockResponse = { locals: {} } as Partial<Response>;
    mockRequest = { params: {}, query: {}, body: {} };
    mockIngredientReadService = {
      getIngredientById: jest.fn(),
      getIngredientByName: jest.fn(),
      getIngredientsByCategory: jest.fn(),
      getAllIngredients: jest.fn(),
      ingredientRepository: jest.fn(),
      mapToIngredientDto: jest.fn(),
    } as unknown as jest.Mocked<IIngredientService>;
    ingredientReadController = new IngredientReadController(mockIngredientReadService);
  });

  describe('getIngredientById', () => {
    beforeEach(() => {
      mockRequest.params = { id: '123' };
    });
    it('should get an ingredient by id successfully', async () => {
      mockIngredientReadService.getIngredientById.mockResolvedValue(
        ResultUtil.success(mockIngredient),
      );
      await ingredientReadController.getIngredientById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockResponse.locals).toEqual({ data: mockIngredient, status: 200 });
      expect(mockNext).toHaveBeenCalledWith();
    });
    it('should pass error to next when ingredient is not found', async () => {
      const error = new IngredientNotFoundError({ message: 'Ingredient not found' });
      mockIngredientReadService.getIngredientById.mockResolvedValue(ResultUtil.fail(error));
      await ingredientReadController.getIngredientById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });

  describe('getIngredientByName', () => {
    it('should get an ingredient by name successfully', async () => {
      mockRequest.query = { name: 'Test Ingredient' };
      mockIngredientReadService.getIngredientByName.mockResolvedValue(
        ResultUtil.success(mockIngredient),
      );
      await ingredientReadController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockResponse.locals).toEqual({ data: mockIngredient, status: 200 });
      expect(mockNext).toHaveBeenCalledWith();
    });
    it('should pass error to next when name parameter is missing', async () => {
      mockRequest.query = {};
      await ingredientReadController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
    it('should pass error to next when ingredient is not found', async () => {
      mockRequest.query = { name: 'Nonexistent Ingredient' };
      const error = new IngredientNotFoundError({ message: 'Ingredient not found' });
      mockIngredientReadService.getIngredientByName.mockResolvedValue(ResultUtil.fail(error));
      await ingredientReadController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });

  describe('getIngredientsByCategory', () => {
    it('should get ingredients by category successfully', async () => {
      const mockList: TIngredientListDto = {
        items: [mockIngredient],
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      };
      mockRequest.query = { category: 'vegetable' };
      mockIngredientReadService.getIngredientsByCategory.mockResolvedValue(
        ResultUtil.success(mockList),
      );
      await ingredientReadController.getIngredientsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockResponse.locals).toEqual({ data: mockList, status: 200 });
      expect(mockNext).toHaveBeenCalledWith();
    });
    it('should pass error to next when category parameter is missing', async () => {
      mockRequest.query = {};
      await ingredientReadController.getIngredientsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
    it('should pass error to next when service returns error', async () => {
      mockRequest.query = { category: 'vegetable' };
      const error = new IngredientError('Some error');
      mockIngredientReadService.getIngredientsByCategory.mockResolvedValue(ResultUtil.fail(error));
      await ingredientReadController.getIngredientsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });

  describe('getAllIngredients', () => {
    it('should get all ingredients successfully', async () => {
      const mockList: TIngredientListDto = {
        items: [mockIngredient],
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      };
      mockIngredientReadService.getAllIngredients.mockResolvedValue(ResultUtil.success(mockList));
      await ingredientReadController.getAllIngredients(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockResponse.locals).toEqual({ data: mockList, status: 200 });
      expect(mockNext).toHaveBeenCalledWith();
    });
    it('should pass error to next when service returns error', async () => {
      const error = new IngredientError('Some error');
      mockIngredientReadService.getAllIngredients.mockResolvedValue(ResultUtil.fail(error));
      await ingredientReadController.getAllIngredients(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });
});
