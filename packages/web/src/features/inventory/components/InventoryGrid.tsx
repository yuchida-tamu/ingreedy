import { useQuery } from '@tanstack/react-query';
import { getUserInventoriesFetcher } from '../apis/getUserInventories';
import { InventoryCard } from './InventoryCard';

export function InventoryGrid() {
  const { data: result } = useQuery({
    queryKey: ['user-inventories'],
    queryFn: getUserInventoriesFetcher,
  });

  return result && result.data.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {result.data.map((item) => (
        <InventoryCard
          key={item.id}
          name={item.ingredient.name}
          quantity={item.quantity}
          unit={item.unit}
          category={item.ingredient.category}
        />
      ))}
    </div>
  ) : (
    <EmptyInventory />
  );
}

function EmptyInventory() {
  return (
    <div className="flex h-full items-center justify-center py-10">
      <p className="text-2xl text-gray-500">No inventory found</p>
    </div>
  );
}
