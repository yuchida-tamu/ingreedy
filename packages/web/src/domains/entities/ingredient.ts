export type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategory;
  createdAt: Date;
  updatedAt: Date;
};

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
