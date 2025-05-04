import { Inventory } from '@/domains/entities/inventory';

export type CreateInventoryWithNewIngredientData = {
  ingredient: {
    name: string;
    category: string;
  };
  quantity: number;
  unit: string;
};

export type CreateInventoryWithNewIngredientResponse =
  | {
      success: true;
      data: Inventory;
    }
  | {
      success: false;
      message: string;
    };

export async function createInventoryWithNewIngredientFetcher(
  data: CreateInventoryWithNewIngredientData,
): Promise<CreateInventoryWithNewIngredientResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_DOMAIN}/inventory/createInventoryWithNewIngredient`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );
  return response.json() as Promise<CreateInventoryWithNewIngredientResponse>;
}
