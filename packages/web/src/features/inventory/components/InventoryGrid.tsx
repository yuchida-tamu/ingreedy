import { InventoryCard } from './InventoryCard';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface InventoryGridProps {
  items: InventoryItem[];
}

export function InventoryGrid({ items }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          name={item.name}
          quantity={item.quantity}
          unit={item.unit}
          category={item.category}
        />
      ))}
    </div>
  );
}
