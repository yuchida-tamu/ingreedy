import type { Request, Response } from 'express';
import type { IIngredientService } from '../../core/application/services/ingredient.service';
import type { TIngredientDto } from '../../core/application/types/dtos/ingredient.dto';
import {
  IngredientAlreadyExistsError,
  IngredientNotFoundError,
} from '../../core/application/types/errors/ingredient-error';
import { ResultUtil } from '../../utils/result.util';
import { IngredientController } from '../ingredient-controller';

describe('IngredientController', () => {
  let ingredientController: IngredientController;
  let mockIngredientService: jest.Mocked<IIngredientService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
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

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };

    mockRequest = {};

    // Create mock service
    mockIngredientService = {
      addIngredient: jest.fn(),
      getIngredientById: jest.fn(),
      getIngredientByName: jest.fn(),
      getIngredientsByCategory: jest.fn(),
      updateIngredient: jest.fn(),
      checkIngredientExists: jest.fn(),
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

      await ingredientController.createIngredient(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredient,
      });
    });

    it('should return 400 when ingredient already exists', async () => {
      mockIngredientService.addIngredient.mockResolvedValue(
        ResultUtil.fail(
          new IngredientAlreadyExistsError({
            message: 'Ingredient already exists',
          }),
        ),
      );

      await ingredientController.createIngredient(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ingredient already exists',
        },
      });
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
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredient,
      });
    });

    it('should return 404 when ingredient is not found', async () => {
      mockIngredientService.getIngredientById.mockResolvedValue(
        ResultUtil.fail(
          new IngredientNotFoundError({
            message: 'Ingredient not found',
          }),
        ),
      );

      await ingredientController.getIngredientById(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ingredient not found',
        },
      });
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
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredient,
      });
    });

    it('should return 400 when name parameter is missing', async () => {
      mockRequest.query = {};

      await ingredientController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Name parameter is required and must be a string',
        },
      });
    });

    it('should return 404 when ingredient is not found', async () => {
      mockRequest.query = { name: 'Nonexistent Ingredient' };
      mockIngredientService.getIngredientByName.mockResolvedValue(
        ResultUtil.fail(
          new IngredientNotFoundError({
            message: 'Ingredient not found',
          }),
        ),
      );

      await ingredientController.getIngredientByName(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ingredient not found',
        },
      });
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
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockIngredientList,
      });
    });

    it('should return 400 when category parameter is missing', async () => {
      mockRequest.query = {};

      await ingredientController.getIngredientsByCategory(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Category parameter is required and must be a string',
        },
      });
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

      await ingredientController.updateIngredient(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedIngredient,
      });
    });

    it('should return 404 when ingredient is not found', async () => {
      mockIngredientService.updateIngredient.mockResolvedValue(
        ResultUtil.fail(
          new IngredientNotFoundError({
            message: 'Ingredient not found',
          }),
        ),
      );

      await ingredientController.updateIngredient(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ingredient not found',
        },
      });
    });

    it('should return 400 when ingredient name already exists', async () => {
      mockIngredientService.updateIngredient.mockResolvedValue(
        ResultUtil.fail(
          new IngredientAlreadyExistsError({
            message: 'Ingredient already exists',
          }),
        ),
      );

      await ingredientController.updateIngredient(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Ingredient already exists',
        },
      });
    });
  });
});
