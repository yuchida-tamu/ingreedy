import { useQuery } from '@tanstack/react-query';
import { getUserInventoriesFetcher } from '../apis/getUserInventories';
import { InventoryCard } from './InventoryCard';

export function InventoryGrid() {
  const { data: result } = useQuery({
    queryKey: ['user-inventories'],
    queryFn: getUserInventoriesFetcher,
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {result && result.data.length > 0 ? (
        result.data.map((item) => (
          <InventoryCard
            key={item.id}
            name={item.ingredient.name}
            quantity={item.quantity}
            unit={item.unit}
            category={item.ingredient.category}
          />
        ))
      ) : (
        <EmptyInventory />
      )}
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-2xl font-bold">No inventory found</p>
    </div>
  );
}
