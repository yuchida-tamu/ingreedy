import { HeroFormContainer } from '@/elements/forms/HeroFormContainer';
import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import { signinFetcher } from '@/features/auth/apis/siginin';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

export function SigninForm() {
  const { Field, Subscribe, handleSubmit, isPending } = useSigninForm();

  return (
    <HeroFormContainer
      title="Sign in"
      // TODO: Add image src
      imageSrc="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <Field name="email">
          {(field) => (
            <LabeledTextField
              label="Email"
              value={field.state.value}
              type="email"
              onChange={field.handleChange}
            />
          )}
        </Field>
        <Field name="password">
          {(field) => (
            <LabeledTextField
              label="Password"
              value={field.state.value}
              type="password"
              onChange={field.handleChange}
            />
          )}
        </Field>
      </div>
      <Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        )}
      </Subscribe>
    </HeroFormContainer>
  );
}

function useSigninForm() {
  const navigate = useNavigate();
  const { handleAuthenticated } = useAuth();
  // TODO: Add type for the response
  const { mutate, isPending } = useMutation<
    { success: boolean; data: { message: string } },
    Error,
    { email: string; password: string }
  >({
    mutationFn: signinFetcher,
    onSuccess: (data) => {
      if (data.success) {
        // Update auth context with the successful sign-in
        handleAuthenticated();
        // Navigate to the user page on success
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
    defaultValues: DEFAULT_VALUES,
    onSubmit: ({ value: { email, password } }) => {
      mutate({
        email,
        password,
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
