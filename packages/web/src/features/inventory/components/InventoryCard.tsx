interface InventoryCardProps {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export function InventoryCard({ name, quantity, unit, category }: InventoryCardProps) {
  return (
    <div className="card bg-base-100 border-base-200 border shadow-md">
      <div className="card-body p-4">
        <h2 className="card-title mb-2 text-lg font-bold">{name}</h2>
        <p className="mb-1 text-sm">
          <span className="font-semibold">Quantity:</span> {quantity} {unit}
        </p>
        <p className="text-base-content/70 text-xs">
          <span className="font-semibold">Category:</span> {category}
        </p>
      </div>
    </div>
  );
}
