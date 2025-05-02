import { InventoryCard } from './InventoryCard';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
};

const mockInventory = [
  {
    id: '1',
    name: 'Flour',
    quantity: 2,
    unit: 'kg',
    category: 'Baking',
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: 12,
    unit: 'pcs',
    category: 'Dairy',
  },
  {
    id: '3',
    name: 'Milk',
    quantity: 1,
    unit: 'L',
    category: 'Dairy',
  },
  {
    id: '4',
    name: 'Tomatoes',
    quantity: 5,
    unit: 'pcs',
    category: 'Vegetables',
  },
] as const satisfies InventoryItem[];

export function InventoryGrid() {
  const data = mockInventory;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((item) => (
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
