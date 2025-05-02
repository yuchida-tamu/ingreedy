import { useMutation } from '@tanstack/react-query';

type CustomMutationProps<T, S> = {
  fetcher: (data: T) => Promise<{ success: boolean; data: S }>;
  onSuccess: (data: { success: boolean; data: S }) => void;
  onError: (error: Error) => void;
};

export function useCustomMutation<T, S>({
  fetcher,
  onSuccess,
  onError,
}: CustomMutationProps<T, S>) {
  const { mutate, isPending } = useMutation<{ success: boolean; data: S }, Error, T>({
    mutationFn: fetcher,
    onSuccess,
    onError,
  });

  return { mutate, isPending };
}
