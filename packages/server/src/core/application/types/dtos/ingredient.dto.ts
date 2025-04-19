import { z } from 'zod';

const categoryEnum = z.enum([
  'vegetable',
  'fruit',
  'meat',
  'dairy',
  'grain',
  'spice',
  'oil',
  'herb',
  'other',
]);

// Schema for adding a new ingredient
const addIngredientDtoSchema = z.object({
  name: z.string().min(1),
  category: categoryEnum,
});

// Schema for updating an ingredient
const updateIngredientDtoSchema = z.object({
  name: z.string().min(1).optional(),
  category: categoryEnum.optional(),
});

// Schema for listing ingredients with filters and pagination
const listIngredientsParamsSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  category: categoryEnum.optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'category', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Response schema for ingredient
const ingredientDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: categoryEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Response schema for paginated ingredient list
const ingredientListDtoSchema = z.object({
  items: z.array(ingredientDtoSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

// TypeScript types derived from schemas
export type TAddIngredientDto = z.infer<typeof addIngredientDtoSchema>;
export type TUpdateIngredientDto = z.infer<typeof updateIngredientDtoSchema>;
export type TListIngredientsParams = z.infer<typeof listIngredientsParamsSchema>;
export type TIngredientDto = z.infer<typeof ingredientDtoSchema>;
export type TIngredientListDto = z.infer<typeof ingredientListDtoSchema>;
