import { InventoryControl } from './InventoryControl';

export function InventoryControlPanel() {
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

  return (
    <div className="mb-6 flex justify-end">
      <button className="btn btn-primary" onClick={handleAddClick}>
        + Add Inventory
      </button>
      <InventoryControl onClose={handleClose} />
    </div>
  );
}
