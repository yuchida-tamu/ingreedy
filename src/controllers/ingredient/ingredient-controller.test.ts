import type { NextFunction, Request, Response } from 'express';
import type { IIngredientService } from '../../core/application/services/ingredient.service';
import type {
  TIngredientDto,
  TIngredientListDto,
} from '../../core/application/types/dtos/ingredient.dto';
import {
  IngredientAlreadyExistsError,
  IngredientError,
  IngredientNotFoundError,
} from '../../core/application/types/errors/ingredient-error';
import { ResultUtil } from '../../utils/result.util';
import { IngredientController } from './ingredient-controller';

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

describe('IngredientController', () => {
  let ingredientController: IngredientController;
  let mockIngredientService: jest.Mocked<IIngredientService>;
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
    // Reset mocks
    mockNext = jest.fn();
    mockResponse = {
      locals: {},
    } as Partial<Response>;

    mockRequest = {
      params: {},
      query: {},
      body: {},
    };

    // Create mock service
    mockIngredientService = {
      addIngredient: jest.fn(),
      getIngredientById: jest.fn(),
      getIngredientByName: jest.fn(),
      getIngredientsByCategory: jest.fn(),
      updateIngredient: jest.fn(),
      checkIngredientExists: jest.fn(),
      getAllIngredients: jest.fn(),
    } as jest.Mocked<IIngredientService>;

    ingredientController = new IngredientController(mockIngredientService);
  });

  describe('createIngredient', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'Test Ingredient',
        category: 'vegetable',
      };
    });

    it('should create an ingredient successfully', async () => {
      mockIngredientService.addIngredient.mockResolvedValue(ResultUtil.success(mockIngredient));

      await ingredientController.createIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.locals).toEqual({
        data: mockIngredient,
        status: 201,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should pass error to next when ingredient already exists', async () => {
      const error = new IngredientAlreadyExistsError({
        message: 'Ingredient already exists',
      });
      mockIngredientService.addIngredient.mockResolvedValue(ResultUtil.fail(error));

      await ingredientController.createIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });

  describe('getIngredientById', () => {
    beforeEach(() => {
      mockRequest.params = { id: '123' };
    });

    it('should get an ingredient by id successfully', async () => {
      mockIngredientService.getIngredientById.mockResolvedValue(ResultUtil.success(mockIngredient));

      await ingredientController.getIngredientById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.locals).toEqual({
        data: mockIngredient,
        status: 200,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should pass error to next when ingredient is not found', async () => {
      const error = new IngredientNotFoundError({
        message: 'Ingredient not found',
      });
      mockIngredientService.getIngredientById.mockResolvedValue(ResultUtil.fail(error));

      await ingredientController.getIngredientById(
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
      mockIngredientService.getIngredientByName.mockResolvedValue(
        ResultUtil.success(mockIngredient),
      );

      await ingredientController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.locals).toEqual({
        data: mockIngredient,
        status: 200,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should pass error to next when name parameter is missing', async () => {
      mockRequest.query = {};

      await ingredientController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      const error = mockNext.mock.calls[0][0];
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(isError(error)).toBe(true);
      if (isError(error)) {
        expect(error.message).toBe('Name parameter is required and must be a string');
      }
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });

    it('should pass error to next when ingredient is not found', async () => {
      mockRequest.query = { name: 'Nonexistent Ingredient' };
      const error = new IngredientNotFoundError({
        message: 'Ingredient not found',
      });
      mockIngredientService.getIngredientByName.mockResolvedValue(ResultUtil.fail(error));

      await ingredientController.getIngredientByName(
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
    const mockIngredientList = {
      items: [mockIngredient],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('should get ingredients by category successfully', async () => {
      mockRequest.query = { category: 'vegetable' };
      mockIngredientService.getIngredientsByCategory.mockResolvedValue(
        ResultUtil.success(mockIngredientList),
      );

      await ingredientController.getIngredientsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.locals).toEqual({
        data: mockIngredientList,
        status: 200,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should pass error to next when category parameter is missing', async () => {
      mockRequest.query = {};

      await ingredientController.getIngredientsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      const error = mockNext.mock.calls[0][0];
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(isError(error)).toBe(true);
      if (isError(error)) {
        expect(error.message).toBe('Category parameter is required and must be a string');
      }
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });

  describe('updateIngredient', () => {
    beforeEach(() => {
      mockRequest.params = { id: '123' };
      mockRequest.body = {
        name: 'Updated Ingredient',
      };
    });

    it('should update an ingredient successfully', async () => {
      const updatedIngredient = {
        ...mockIngredient,
        name: 'Updated Ingredient',
      };

      mockIngredientService.updateIngredient.mockResolvedValue(
        ResultUtil.success(updatedIngredient),
      );

      await ingredientController.updateIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.locals).toEqual({
        data: updatedIngredient,
        status: 200,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should pass error to next when ingredient is not found', async () => {
      const error = new IngredientNotFoundError({
        message: 'Ingredient not found',
      });
      mockIngredientService.updateIngredient.mockResolvedValue(ResultUtil.fail(error));

      await ingredientController.updateIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });

    it('should pass error to next when ingredient name already exists', async () => {
      const error = new IngredientAlreadyExistsError({
        message: 'Ingredient already exists',
      });
      mockIngredientService.updateIngredient.mockResolvedValue(ResultUtil.fail(error));

      await ingredientController.updateIngredient(
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
    it('should return all ingredients successfully', async () => {
      const mockIngredients: TIngredientListDto = {
        items: [
          {
            id: 'test-id-1',
            name: 'Test Ingredient 1',
            category: 'vegetable',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'test-id-2',
            name: 'Test Ingredient 2',
            category: 'fruit',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      };

      mockIngredientService.getAllIngredients.mockResolvedValue(
        ResultUtil.success(mockIngredients),
      );

      await ingredientController.getAllIngredients(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockIngredientService.getAllIngredients).toHaveBeenCalled();
      expect(mockResponse.locals).toEqual({
        data: mockIngredients,
        status: 200,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with error when getAllIngredients returns error', async () => {
      const mockError = new IngredientError('Failed to get ingredients');
      mockIngredientService.getAllIngredients.mockResolvedValue(ResultUtil.fail(mockError));

      await ingredientController.getAllIngredients(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockIngredientService.getAllIngredients).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });
});
