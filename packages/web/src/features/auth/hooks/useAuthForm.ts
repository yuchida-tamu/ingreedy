import { useAuth } from '@/features/auth/context/AuthContext';
import { useCustomMutation } from '@/infra/hooks/useCustomMutation';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

type Args<T> = {
  defaultValues: T & { [key: string]: string };
  fetcher: (
    data: T,
  ) => Promise<{ success: true; data: { message: string } } | { success: false; message: string }>;
};

export function useAuthForm<T>({ defaultValues, fetcher }: Args<T>) {
  const navigate = useNavigate();
  const { handleAuthenticated } = useAuth();

  const { mutate, isPending } = useCustomMutation<T, { message: string }>({
    fetcher: fetcher,
    onSuccess: (data) => {
      if (data.success) {
        // Update auth context with the successful sign-in
        handleAuthenticated();
        navigate({ to: '/user' });
      } else {
        // TODO: Show error message
      }
    },
    onError: (error) => {
      console.log('error', error);
      // TODO: Show error message
    },
  });

  const {
    Field,
    Subscribe,
    handleSubmit: submit,
  } = useForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      mutate({
        ...value,
      });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  return { Field, Subscribe, handleSubmit, isPending };
}
