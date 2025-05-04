import { InventoryControlPanel } from '@/features/inventory/components/InventoryControlPanel';
import { InventoryGrid } from '@/features/inventory/components/InventoryGrid';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
export const Route = createFileRoute('/inventory/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-2xl font-bold">Your Inventory</h1>
          <InventoryControlPanel />
        </div>
        <div className="divider" />
        <Suspense fallback={<div>Loading...</div>}>
          <InventoryGrid />
        </Suspense>
      </div>
    </div>
  );
}
