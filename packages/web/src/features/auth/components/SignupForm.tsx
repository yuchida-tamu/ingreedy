import { HeroFormContainer } from '@/elements/forms/HeroFormContainer';
import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import { signupFetcher } from '@/features/auth/apis/signup';
import { useAuthForm } from '@/features/auth/hooks/useAuthForm';

const DEFAULT_VALUES = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function SignupForm() {
  const { Field, Subscribe, handleSubmit } = useAuthForm({
    defaultValues: DEFAULT_VALUES,
    fetcher: signupFetcher,
  });

  return (
    <HeroFormContainer
      title="Sign up"
      // TODO: Add image src
      imageSrc="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <Field name="username">
          {(field) => (
            <LabeledTextField
              label="Username"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </Field>
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
        <Field name="confirmPassword">
          {(field) => (
            <LabeledTextField
              label="Confirm Password"
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
            Sign up
          </button>
        )}
      </Subscribe>
    </HeroFormContainer>
  );
}
