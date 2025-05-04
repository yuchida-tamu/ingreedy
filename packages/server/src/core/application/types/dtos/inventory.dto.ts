import { z } from 'zod';

export const createInventoryWithIngredientIdDtoSchema = z.object({
  ingredientId: z.string().uuid(),
  quantity: z.number().min(0),
  unit: z.enum(['kg', 'g', 'l', 'ml', 'piece']),
});

export const createInventoryWithNewIngredientDtoSchema = z.object({
  ingredient: z.object({
    name: z.string().min(1),
    category: z.string().min(1),
  }),
  quantity: z.number().min(0),
  unit: z.enum(['kg', 'g', 'l', 'ml', 'piece']),
});

export type TCreateInventoryWithIngredientIdDto = z.infer<
  typeof createInventoryWithIngredientIdDtoSchema
>;
export type TCreateInventoryWithNewIngredientDto = z.infer<
  typeof createInventoryWithNewIngredientDtoSchema
>;
