import { z } from 'zod';

export const inventorySchema = z.object({
  id: z.string().uuid(),
  ingredientId: z.string().uuid(),
  quantity: z.number().min(0),
  unit: z.enum(['kg', 'g', 'l', 'ml', 'piece']),
  userId: z.string().uuid(), // New field to associate inventory with a user
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Inventory = z.infer<typeof inventorySchema>;
export type InventoryId = string & { readonly _brand: unique symbol };
export type InventoryIngredientId = string & { readonly _brand: unique symbol };
export type InventoryQuantity = number & { readonly _brand: unique symbol };
export type InventoryUnit = 'kg' | 'g' | 'l' | 'ml' | 'piece';
export type InventoryUserId = string & { readonly _brand: unique symbol }; // New type for userId
export type InventoryCreatedAt = Date & { readonly _brand: unique symbol };
export type InventoryUpdatedAt = Date & { readonly _brand: unique symbol };
export type InventoryDto = Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>;
export type InventoryUpdateData = Partial<Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>>;
export type InventoryCreateData = Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>;
