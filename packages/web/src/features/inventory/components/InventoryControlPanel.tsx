import { InventoryControl } from './InventoryControl';

type IngredientOption = {
  id: string;
  name: string;
  category: string;
};

type InventoryControlPanelProps = {
  ingredientOptions: IngredientOption[];
  onAddInventory: (data: { ingredientId: string; quantity: number; unit: string }) => void;
};

export function InventoryControlPanel({
  ingredientOptions,
  onAddInventory,
}: InventoryControlPanelProps) {
  const handleAddClick = () => {
    const dialog = document.getElementById('inventory-control') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };
  const handleClose = () => {
    const dialog = document.getElementById('inventory-control') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };
  const handleSubmit = (data: { ingredientId: string; quantity: number; unit: string }) => {
    onAddInventory(data);
    const dialog = document.getElementById('inventory-control') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  return (
    <div className="mb-6 flex justify-end">
      <button className="btn btn-primary" onClick={handleAddClick}>
        + Add Inventory
      </button>
      <InventoryControl
        onClose={handleClose}
        onSubmit={handleSubmit}
        ingredientOptions={ingredientOptions}
      />
    </div>
  );
}
