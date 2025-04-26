import { LabeledTextField } from '@/elements/forms/LabeledTextField';
import { useSigninForm } from '@/features/auth/hooks/useSigninForm';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}>;

function SigninFormContainer({ children, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row bg-secondary-content rounded-lg">
          <img
            // TODO: Replace the image with a logo
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="max-w-sm rounded-lg"
          />
          <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold">Sign In</h1>
            {children}
          </div>
        </div>
      </div>
    </form>
  );
}

export function SigninForm() {
  const { form, handleSubmit } = useSigninForm();

  return (
    <SigninFormContainer onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <form.Field
          name="email"
          children={(field) => (
            <LabeledTextField
              label="Email"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <LabeledTextField
              label="Password"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        />
      </div>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            Sign in
          </button>
        )}
      </form.Subscribe>
    </SigninFormContainer>
  );
}
