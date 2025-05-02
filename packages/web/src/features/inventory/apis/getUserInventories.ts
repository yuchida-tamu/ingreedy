import { Inventory } from '@/domains/entities/inventory';

export async function getUserInventoriesFetcher(): Promise<Inventory[]> {
  try {
    const response = await fetch('http://localhost:8000/api/v1/inventory/getUserInventories', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user inventories');
    }

    const data = (await response.json()) as { success: boolean; data: Inventory[] };

    if (!data.success) {
      throw new Error('Failed to fetch user inventories');
    }

    const { data: inventoryData } = data;

    return inventoryData;
  } catch (error) {
    console.error('Error fetching user inventories:', error);
    throw error;
  }
}
