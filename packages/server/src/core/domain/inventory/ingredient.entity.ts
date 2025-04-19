import { z } from 'zod';

export const ingredientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
export type IngredientId = string & { readonly _brand: unique symbol };
export type IngredientName = string & { readonly _brand: unique symbol };
export type IngredientCategory =
  | 'vegetable'
  | 'fruit'
  | 'meat'
  | 'dairy'
  | 'grain'
  | 'spice'
  | 'oil'
  | 'herb'
  | 'other';
