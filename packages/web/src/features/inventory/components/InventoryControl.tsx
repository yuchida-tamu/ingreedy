import { Inventory } from '@/domains/entities/inventory';
import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import {
  CreateInventoryWithNewIngredientData,
  createInventoryWithNewIngredientFetcher,
} from '@/features/inventory/apis/createInventory';
import { useCustomMutation } from '@/infra/hooks/useCustomMutation';
import { useForm } from '@tanstack/react-form';

interface InventoryControlProps {
  onClose: () => void;
}

const unitOptions = ['kg', 'g', 'l', 'ml', 'piece'];

export function InventoryControl({ onClose }: InventoryControlProps) {
  const { mutate: createInventoryWithNewIngredient } = useCustomMutation<
    CreateInventoryWithNewIngredientData,
    Inventory
  >({
    fetcher: createInventoryWithNewIngredientFetcher,
    onSuccess: () => {
      onClose();
    },
    onError: () => {
      console.error('Failed to create inventory with new ingredient');
    },
  });
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      ingredientId: '',
      ingredientName: '',
      ingredientCategory: '',
      quantity: '1',
      unit: unitOptions[0],
    },
    onSubmit: ({ value }) => {
      console.log(value);
      createInventoryWithNewIngredient({
        ingredient: {
          name: value.ingredientName,
          category: value.ingredientCategory,
        },
        quantity: Number(value.quantity),
        unit: value.unit,
      });
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <dialog id="inventory-control" className="modal">
      <div className="modal-box">
        <h3 className="mb-4 text-lg font-bold">{'Add Inventory'}</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
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
          </div>
          <div>
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <Field name="quantity">
              {(field) => (
                <LabeledTextField
                  label="Quantity"
                  value={field.state.value}
                  onChange={field.handleChange}
                />
              )}
            </Field>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Unit</span>
            </label>
            <Field name="unit">
              {(field) => (
                <div>
                  <select
                    className="select select-bordered w-full"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  >
                    {unitOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
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
  );
}
