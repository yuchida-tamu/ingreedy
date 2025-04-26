import { useForm } from '@tanstack/react-form';
import { useCallback } from 'react';

export const useSigninForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: (data) => {
      console.log(data);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      form.handleSubmit();
    },
    [form]
  );

  return { form, handleSubmit };
};
