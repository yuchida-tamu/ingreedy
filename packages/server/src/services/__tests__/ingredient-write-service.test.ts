import type { IIngredientRepository } from '../../core/application/repositories/ingredient.repository';
import {
  IngredientAlreadyExistsError,
  IngredientNotFoundError,
} from '../../core/application/types/errors/ingredient-error';
import type { Ingredient, IngredientCategory } from '../../core/domain/inventory/ingredient.entity';
import { IngredientWriteService } from '../ingredient/ingredient-write-service';

describe('IngredientWriteService', () => {
  let ingredientWriteService: IngredientWriteService;
  let mockIngredientRepository: jest.Mocked<IIngredientRepository>;

  const mockIngredient: Ingredient = {
    id: '123',
    name: 'Test Ingredient',
    category: 'vegetable' as IngredientCategory,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockIngredientRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findByCategory: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    ingredientWriteService = new IngredientWriteService(mockIngredientRepository);
  });

  describe('addIngredient', () => {
    it('should successfully create a new ingredient', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(null);
      mockIngredientRepository.create.mockResolvedValue(mockIngredient);
      const result = await ingredientWriteService.addIngredient({
        name: 'Test Ingredient',
        category: 'vegetable' as IngredientCategory,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          id: '123',
          name: 'Test Ingredient',
          category: 'vegetable',
        });
      }
    });
    it('should return error when ingredient with same name exists', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);
      const result = await ingredientWriteService.addIngredient({
        name: 'Test Ingredient',
        category: 'vegetable' as IngredientCategory,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(IngredientAlreadyExistsError);
      }
    });
  });

  describe('updateIngredient', () => {
    it('should successfully update an ingredient', async () => {
      const updatedIngredient = {
        ...mockIngredient,
        name: 'Updated Ingredient',
        updatedAt: new Date('2024-01-02'),
      };
      mockIngredientRepository.findById.mockResolvedValue(mockIngredient);
      mockIngredientRepository.findByName.mockResolvedValue(null);
      mockIngredientRepository.update.mockResolvedValue(updatedIngredient);
      const result = await ingredientWriteService.updateIngredient('123', {
        name: 'Updated Ingredient',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          id: '123',
          name: 'Updated Ingredient',
          category: 'vegetable',
        });
      }
    });
    it('should return error when ingredient is not found', async () => {
      mockIngredientRepository.findById.mockResolvedValue(null);
      const result = await ingredientWriteService.updateIngredient('123', {
        name: 'Updated Ingredient',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(IngredientNotFoundError);
      }
    });
    it('should return error when name is already taken', async () => {
      mockIngredientRepository.findById.mockResolvedValue(mockIngredient);
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);
      const result = await ingredientWriteService.updateIngredient('123', {
        name: 'Test Ingredient Update',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(IngredientAlreadyExistsError);
      }
    });
  });
});
