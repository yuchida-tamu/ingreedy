import { InventoryGrid } from '@/features/inventory/components/InventoryGrid';
import { createFileRoute } from '@tanstack/react-router';

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
];

export const Route = createFileRoute('/inventory/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Your Inventory</h1>
        <InventoryGrid items={mockInventory} />
      </div>
    </div>
  );
}
