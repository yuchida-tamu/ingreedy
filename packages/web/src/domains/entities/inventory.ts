import { Ingredient } from './ingredient';
export type Inventory = {
  id: string;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
};

export type InventoryId = string & { readonly _brand: unique symbol };
export type InventoryQuantity = number & { readonly _brand: unique symbol };
export type InventoryUnit = 'kg' | 'g' | 'l' | 'ml' | 'piece';
