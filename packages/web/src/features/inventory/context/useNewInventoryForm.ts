import {
  CreateInventoryWithNewIngredientData,
  createInventoryWithNewIngredientFetcher,
} from '@/domains/apis/createInventory';
import { Inventory } from '@/domains/entities/inventory';
import { useCustomMutation } from '@/infra/hooks/useCustomMutation';
import { useForm } from '@tanstack/react-form';

export function useNewInventoryForm() {
  const unitOptions = ['kg', 'g', 'l', 'ml', 'piece'];
  const quantityOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const { mutate } = useCustomMutation<CreateInventoryWithNewIngredientData, Inventory>({
    fetcher: createInventoryWithNewIngredientFetcher,
    onSuccess: () => {},
    onError: () => {
      console.error('Failed to create inventory with new ingredient');
    },
  });

  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      ingredientId: '',
      ingredientName: '',
      ingredientCategory: '',
      quantity: quantityOptions[0],
      unit: unitOptions[0],
    },
    onSubmit: async ({ value }) => {
      await mutate({
        ingredient: {
          name: value.ingredientName,
          category: value.ingredientCategory,
        },
        quantity: Number(value.quantity),
        unit: value.unit,
      });
    },
  });

  return { unitOptions, quantityOptions, Field, Subscribe, handleSubmit, reset };
}
