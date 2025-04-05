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
import { IngredientController } from '../ingredient-controller';

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

describe('IngredientController', () => {
  let ingredientController: IngredientController;
  let mockIngredientService: jest.Mocked<IIngredientService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockNext: jest.MockedFunction<NextFunction>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const mockIngredient: TIngredientDto = {
    id: '123',
    name: 'Test Ingredient',
    category: 'vegetable',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    // Reset mocks
    jsonMock = jest.fn().mockReturnThis();
    statusMock = jest.fn().mockReturnThis();
    mockNext = jest.fn();

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    } as unknown as Response;

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

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredient,
      });
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
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
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

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredient,
      });
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
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
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

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredient,
      });
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
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
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
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
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

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredientList,
      });
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
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
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

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedIngredient,
      });
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
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
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
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('getAllIngredients', () => {
    it('should return all ingredients with 200 status when successful', async () => {
      // Arrange
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

      // Act
      await ingredientController.getAllIngredients(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockIngredientService.getAllIngredients).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredients,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when getAllIngredients returns error', async () => {
      // Arrange
      const mockError = new IngredientError('Failed to get ingredients');
      mockIngredientService.getAllIngredients.mockResolvedValue(ResultUtil.fail(mockError));

      // Act
      await ingredientController.getAllIngredients(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockIngredientService.getAllIngredients).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});
