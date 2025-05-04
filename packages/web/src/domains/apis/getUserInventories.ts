import { Inventory } from '@/domains/entities/inventory';

export type GetUserInventoriesResponse = {
  success: boolean;
  data: Inventory[];
};

export async function getUserInventoriesFetcher(): Promise<GetUserInventoriesResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_DOMAIN}/inventory/getUserInventories`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user inventories');
    }

    const data = (await response.json()) as GetUserInventoriesResponse;

    if (!data.success) {
      return {
        success: false,
        data: [],
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      data: [],
    };
  }
}
