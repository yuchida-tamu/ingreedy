import { signinMutation } from '@/apis/siginin';
import { HeroFormContainer } from '@/elements/forms/HeroFormContainer';
import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import { useAuthHook } from '@/features/auth/hooks/useAuthHook';
import { useMutation } from '@tanstack/react-query';

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

export function SigninForm() {
  const { mutate } = useMutation({
    mutationFn: signinMutation,
  });

  const { Field, Subscribe, handleSubmit } = useAuthHook({
    defaultValues: DEFAULT_VALUES,
    onSubmit: ({ value: { email, password } }) => {
      mutate({
        email,
        password,
      });
    },
  });

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
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            Sign in
          </button>
        )}
      </Subscribe>
    </HeroFormContainer>
  );
}
