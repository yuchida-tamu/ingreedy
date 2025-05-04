import type { IIngredientRepository } from '../../core/application/repositories/ingredient.repository';
import { IngredientNotFoundError } from '../../core/application/types/errors/ingredient-error';
import type { Ingredient, IngredientCategory } from '../../core/domain/inventory/ingredient.entity';
import { IngredientReadService } from '../ingredient/ingredient-read-service';

describe('IngredientReadService', () => {
  let ingredientReadService: IngredientReadService;
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
    ingredientReadService = new IngredientReadService(mockIngredientRepository);
  });

  describe('getIngredientById', () => {
    it('should return ingredient by id', async () => {
      mockIngredientRepository.findById.mockResolvedValue(mockIngredient);
      const result = await ingredientReadService.getIngredientById('123');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          id: '123',
          name: 'Test Ingredient',
          category: 'vegetable',
        });
      }
    });
    it('should return error if not found', async () => {
      mockIngredientRepository.findById.mockResolvedValue(null);
      const result = await ingredientReadService.getIngredientById('123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(IngredientNotFoundError);
      }
    });
  });

  describe('getIngredientByName', () => {
    it('should return ingredient by name', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);
      const result = await ingredientReadService.getIngredientByName('Test Ingredient');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          id: '123',
          name: 'Test Ingredient',
          category: 'vegetable',
        });
      }
    });
    it('should return error if not found', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(null);
      const result = await ingredientReadService.getIngredientByName('Test Ingredient');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(IngredientNotFoundError);
      }
    });
  });

  describe('getIngredientsByCategory', () => {
    it('should return ingredients by category', async () => {
      mockIngredientRepository.findByCategory.mockResolvedValue([mockIngredient]);
      const result = await ingredientReadService.getIngredientsByCategory('vegetable');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items.length).toBe(1);
        expect(result.data.items[0]).toMatchObject({
          id: '123',
          name: 'Test Ingredient',
          category: 'vegetable',
        });
      }
    });
  });

  describe('getAllIngredients', () => {
    it('should return all ingredients', async () => {
      mockIngredientRepository.findAll.mockResolvedValue([mockIngredient]);
      const result = await ingredientReadService.getAllIngredients();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items.length).toBe(1);
        expect(result.data.items[0]).toMatchObject({
          id: '123',
          name: 'Test Ingredient',
          category: 'vegetable',
        });
      }
    });
  });
});
