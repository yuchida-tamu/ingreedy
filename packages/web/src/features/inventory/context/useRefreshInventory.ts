import { useQueryClient } from '@tanstack/react-query';

import { getUserInventoriesFetcher } from '@/features/inventory/apis/getUserInventories';

import { GetUserInventoriesResponse } from '@/features/inventory/apis/getUserInventories';
import { useMutation } from '@tanstack/react-query';

export function useRefreshInventory() {
  const queryClient = useQueryClient();
  const { mutate: refreshInventory } = useMutation<GetUserInventoriesResponse, Error, void>({
    mutationFn: getUserInventoriesFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-inventories'] });
    },
  });

  return { refreshInventory };
}
