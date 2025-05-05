type DeleteInventoryResponse = {
  success: boolean;
  error?: string;
};

export async function deleteInventoryFetcher(id: string): Promise<DeleteInventoryResponse> {
  const response = await fetch(`${import.meta.env.VITE_APP_API_DOMAIN}/inventory/deleteInventory`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id }),
  });
  return response.json();
}
