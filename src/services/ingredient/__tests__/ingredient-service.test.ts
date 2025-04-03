import type { IIngredientRepository } from '../../../core/application/repositories/ingredient.repository';
import {
  IngredientAlreadyExistsError,
  IngredientNotFoundError,
} from '../../../core/application/types/errors/ingredient-error';
import type {
  Ingredient,
  IngredientCategory,
} from '../../../core/domain/inventory/ingredient.entity';
import { IngredientService } from '../ingredient-service';

describe('IngredientService', () => {
  let ingredientService: IngredientService;
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
      create: jest.fn(),
      update: jest.fn(),
    };

    ingredientService = new IngredientService(mockIngredientRepository);
  });

  describe('addIngredient', () => {
    it('should successfully create a new ingredient', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(null);
      mockIngredientRepository.create.mockResolvedValue(mockIngredient);

      const result = await ingredientService.addIngredient({
        name: 'Test Ingredient',
        category: 'vegetable' as IngredientCategory,
      });

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toEqual({
        id: '123',
        name: 'Test Ingredient',
        category: 'vegetable',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return error when ingredient with same name exists', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);

      const result = await ingredientService.addIngredient({
        name: 'Test Ingredient',
        category: 'vegetable' as IngredientCategory,
      });

      if (result.success) {
        fail('Expected error but got success');
      }

      expect(result.error).toBeInstanceOf(IngredientAlreadyExistsError);
    });
  });

  describe('getIngredientById', () => {
    it('should successfully return an ingredient by id', async () => {
      mockIngredientRepository.findById.mockResolvedValue(mockIngredient);

      const result = await ingredientService.getIngredientById('123');

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toEqual({
        id: '123',
        name: 'Test Ingredient',
        category: 'vegetable',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return error when ingredient is not found', async () => {
      mockIngredientRepository.findById.mockResolvedValue(null);

      const result = await ingredientService.getIngredientById('123');

      if (result.success) {
        fail('Expected error but got success');
      }

      expect(result.error).toBeInstanceOf(IngredientNotFoundError);
    });
  });

  describe('getIngredientByName', () => {
    it('should successfully return an ingredient by name', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);

      const result = await ingredientService.getIngredientByName('Test Ingredient');

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toEqual({
        id: '123',
        name: 'Test Ingredient',
        category: 'vegetable',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return error when ingredient is not found', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(null);

      const result = await ingredientService.getIngredientByName('Test Ingredient');

      if (result.success) {
        fail('Expected error but got success');
      }

      expect(result.error).toBeInstanceOf(IngredientNotFoundError);
    });
  });

  describe('getIngredientsByCategory', () => {
    it('should successfully return ingredients by category', async () => {
      mockIngredientRepository.findByCategory.mockResolvedValue([mockIngredient]);

      const result = await ingredientService.getIngredientsByCategory(
        'vegetable' as IngredientCategory,
      );

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toEqual({
        items: [
          {
            id: '123',
            name: 'Test Ingredient',
            category: 'vegetable',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      });
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

      const result = await ingredientService.updateIngredient('123', {
        name: 'Updated Ingredient',
      });

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toEqual({
        id: '123',
        name: 'Updated Ingredient',
        category: 'vegetable',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return error when ingredient is not found', async () => {
      mockIngredientRepository.findById.mockResolvedValue(null);

      const result = await ingredientService.updateIngredient('123', {
        name: 'Updated Ingredient',
      });

      if (result.success) {
        fail('Expected error but got success');
      }

      expect(result.error).toBeInstanceOf(IngredientNotFoundError);
    });

    it('should return error when new name already exists', async () => {
      mockIngredientRepository.findById.mockResolvedValue(mockIngredient);
      mockIngredientRepository.findByName.mockResolvedValue({
        ...mockIngredient,
        id: '456',
        name: 'Updated Ingredient',
      });

      const result = await ingredientService.updateIngredient('123', {
        name: 'Updated Ingredient',
      });

      if (result.success) {
        fail('Expected error but got success');
      }

      expect(result.error).toBeInstanceOf(IngredientAlreadyExistsError);
    });
  });

  describe('checkIngredientExists', () => {
    it('should return true when ingredient exists', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(mockIngredient);

      const result = await ingredientService.checkIngredientExists('Test Ingredient');

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toBe(true);
    });

    it('should return false when ingredient does not exist', async () => {
      mockIngredientRepository.findByName.mockResolvedValue(null);

      const result = await ingredientService.checkIngredientExists('Test Ingredient');

      if (!result.success) {
        fail('Expected success but got error');
      }

      expect(result.data).toBe(false);
    });
  });
});
