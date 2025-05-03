import React, { useEffect, useState } from 'react';

interface IngredientOption {
  id: string;
  name: string;
  category: string;
}

interface InventoryControlProps {
  onClose: () => void;
  onSubmit: (data: { ingredientId: string; quantity: number; unit: string }) => void;
  ingredientOptions: IngredientOption[];
  initialData?: {
    ingredientId: string;
    quantity: number;
    unit: string;
  };
}

const unitOptions = ['kg', 'g', 'l', 'ml', 'piece'];

export function InventoryControl({
  onClose,
  onSubmit,
  ingredientOptions,
  initialData,
}: InventoryControlProps) {
  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(unitOptions[0]);

  useEffect(() => {
    if (initialData) {
      setIngredientId(initialData.ingredientId);
      setQuantity(initialData.quantity);
      setUnit(initialData.unit);
    } else {
      setIngredientId('');
      setQuantity(1);
      setUnit(unitOptions[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ingredientId, quantity, unit });
  };

  return (
    <dialog id="inventory-control" className="modal">
      <div className="modal-box">
        <h3 className="mb-4 text-lg font-bold">
          {initialData ? 'Edit Inventory' : 'Add Inventory'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Ingredient</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={ingredientId}
              onChange={(e) => setIngredientId(e.target.value)}
              required
              disabled={!!initialData}
            >
              <option value="" disabled>
                Select ingredient
              </option>
              {ingredientOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} ({opt.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Unit</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            >
              {unitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
