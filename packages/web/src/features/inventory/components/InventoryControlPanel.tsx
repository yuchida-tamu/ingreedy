import { LabeledSelectField } from '@/elements/forms/LabeledSelectField';
import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import { useNewInventoryForm } from '@/features/inventory/context/useNewInventoryForm';
import { useRefreshInventory } from '@/features/inventory/context/useRefreshInventory';

export function InventoryControlPanel() {
  const { unitOptions, quantityOptions, Field, Subscribe, handleSubmit } = useNewInventoryForm();
  const { refreshInventory } = useRefreshInventory();

  const open = () => {
    const dialog = document.getElementById('inventory-control') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };
  const close = () => {
    const dialog = document.getElementById('inventory-control') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSubmit();
    refreshInventory();

    close();
  };

  return (
    <div className="flex justify-end">
      <button className="btn btn-primary" onClick={open}>
        + Add Inventory
      </button>
      <dialog id="inventory-control" className="modal">
        <div className="modal-box">
          <h3 className="mb-4 text-lg font-bold">{'New Inventory'}</h3>
          <form onSubmit={submit} className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Field name="ingredientName">
                {(field) => (
                  <LabeledTextField
                    label="Ingredient"
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </Field>

              <Field name="ingredientCategory">
                {(field) => (
                  <LabeledTextField
                    label="Ingredient Category"
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </Field>

              <Field name="quantity">
                {(field) => (
                  <LabeledSelectField
                    label="Quantity"
                    options={quantityOptions}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </Field>

              <Field name="unit">
                {(field) => (
                  <LabeledSelectField
                    label="Unit"
                    options={unitOptions}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </Field>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={close}>
                Cancel
              </button>
              <Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </button>
                )}
              </Subscribe>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
