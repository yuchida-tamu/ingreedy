import { HeroFormContainer } from '@/elements/forms/HeroFormContainer';
import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import { signinFetcher } from '@/features/auth/apis/siginin';
import { useAuthForm } from '@/features/auth/hooks/useAuthForm';

const DEFAULT_VALUES = {
  email: '',
  password: '',
};

export function SigninForm() {
  const { Field, Subscribe, handleSubmit, isPending } = useAuthForm<{
    email: string;
    password: string;
  }>({
    defaultValues: DEFAULT_VALUES,
    fetcher: signinFetcher,
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
          <button className="btn btn-primary" type="submit" disabled={isSubmitting || isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        )}
      </Subscribe>
    </HeroFormContainer>
  );
}
