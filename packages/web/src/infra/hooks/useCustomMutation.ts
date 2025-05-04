import { useMutation } from '@tanstack/react-query';

type CustomMutationResponse<S> = { success: true; data: S } | { success: false; message: string };

type CustomMutationProps<T, S> = {
  fetcher: (data: T) => Promise<CustomMutationResponse<S>>;
  onSuccess: (data: CustomMutationResponse<S>) => void;
  onError: (error: Error) => void;
};

export function useCustomMutation<T, S>({
  fetcher,
  onSuccess,
  onError,
}: CustomMutationProps<T, S>) {
  const { mutate, isPending } = useMutation<CustomMutationResponse<S>, Error, T>({
    mutationFn: fetcher,
    onSuccess,
    onError,
  });

  return { mutate, isPending };
}
