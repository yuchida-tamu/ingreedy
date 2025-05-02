import { useForm } from '@tanstack/react-form';
import { useCallback } from 'react';

type Args<T> = {
  defaultValues: T;
  onSubmit: (props: { value: T }) => Promise<void> | void;
};

export function useAuthHook<T>({ defaultValues, onSubmit }: Args<T>) {
  const {
    Field,
    Subscribe,
    handleSubmit: submit,
  } = useForm({
    defaultValues,
    onSubmit,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  return { Field, Subscribe, handleSubmit };
}
