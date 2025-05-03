import { InventoryControlPanel } from '@/features/inventory/components/InventoryControlPanel';
import { InventoryGrid } from '@/features/inventory/components/InventoryGrid';
import { createFileRoute } from '@tanstack/react-router';

const mockIngredientOptions = [
  { id: 'ingredient-1', name: 'Flour', category: 'Baking' },
  { id: 'ingredient-2', name: 'Eggs', category: 'Dairy' },
  { id: 'ingredient-3', name: 'Milk', category: 'Dairy' },
  { id: 'ingredient-4', name: 'Tomatoes', category: 'Vegetables' },
];

export const Route = createFileRoute('/inventory/')({
  component: RouteComponent,
});

function RouteComponent() {
  const handleAddInventory = (data: { ingredientId: string; quantity: number; unit: string }) => {
    // For now, just log the data. Replace with actual add logic later.
    console.log('Add inventory:', data);
  };

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Your Inventory</h1>
        <InventoryControlPanel
          ingredientOptions={mockIngredientOptions}
          onAddInventory={handleAddInventory}
        />
        <InventoryGrid />
      </div>
    </div>
  );
}
