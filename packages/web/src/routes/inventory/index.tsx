import { InventoryControlPanel } from '@/features/inventory/components/InventoryControlPanel';
import { InventoryGrid } from '@/features/inventory/components/InventoryGrid';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/inventory/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Your Inventory</h1>
        <InventoryControlPanel />
        <InventoryGrid />
      </div>
    </div>
  );
}
