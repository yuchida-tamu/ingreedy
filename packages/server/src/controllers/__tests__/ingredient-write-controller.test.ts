import type { NextFunction, Request, Response } from 'express';
import type { TIngredientDto } from '../../core/application/types/dtos/ingredient.dto';
import {
  IngredientAlreadyExistsError,
  IngredientNotFoundError,
} from '../../core/application/types/errors/ingredient-error';
import type { IngredientWriteService } from '../../services/ingredient/ingredient-write-service';
import { ResultUtil } from '../../utils/result.util';
import { IngredientWriteController } from '../ingredient/ingredient-write-controller';

describe('IngredientWriteController', () => {
  let ingredientWriteController: IngredientWriteController;
  let mockIngredientWriteService: jest.Mocked<IngredientWriteService>;
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
    mockIngredientWriteService = {
      addIngredient: jest.fn(),
      updateIngredient: jest.fn(),
      ingredientRepository: jest.fn(),
      mapToIngredientDto: jest.fn(),
    } as unknown as jest.Mocked<IngredientWriteService>;
    ingredientWriteController = new IngredientWriteController(mockIngredientWriteService);
  });

  describe('createIngredient', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'Test Ingredient',
        category: 'vegetable',
      };
    });
    it('should create an ingredient successfully', async () => {
      mockIngredientWriteService.addIngredient.mockResolvedValue(
        ResultUtil.success(mockIngredient),
      );
      await ingredientWriteController.createIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockResponse.locals).toEqual({ data: mockIngredient, status: 201 });
      expect(mockNext).toHaveBeenCalledWith();
    });
    it('should pass error to next when ingredient already exists', async () => {
      const error = new IngredientAlreadyExistsError({ message: 'Ingredient already exists' });
      mockIngredientWriteService.addIngredient.mockResolvedValue(ResultUtil.fail(error));
      await ingredientWriteController.createIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.locals).not.toHaveProperty('data');
      expect(mockResponse.locals).not.toHaveProperty('status');
    });
  });

  describe('updateIngredient', () => {
    beforeEach(() => {
      mockRequest.params = { id: '123' };
      mockRequest.body = { name: 'Updated Ingredient', category: 'vegetable' };
    });
    it('should update an ingredient successfully', async () => {
      mockIngredientWriteService.updateIngredient.mockResolvedValue(
        ResultUtil.success(mockIngredient),
      );
      await ingredientWriteController.updateIngredient(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      expect(mockResponse.locals).toEqual({ data: mockIngredient, status: 200 });
      expect(mockNext).toHaveBeenCalledWith();
    });
    it('should pass error to next when ingredient is not found', async () => {
      const error = new IngredientNotFoundError({ message: 'Ingredient not found' });
      mockIngredientWriteService.updateIngredient.mockResolvedValue(ResultUtil.fail(error));
      await ingredientWriteController.updateIngredient(
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
