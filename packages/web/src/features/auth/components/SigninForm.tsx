import {
  signinFormOptions,
  useSigninForm,
  withSigninForm,
} from '@/features/auth/hooks/useSigninForm';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  title: string;
}>;

function SigninFormContainer({ children, title }: Props) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row bg-secondary-content rounded-lg">
        <img
          src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
          className="max-w-sm rounded-lg"
        />
        <div className="flex flex-col h-full gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

const SigninFormView = withSigninForm({
  ...signinFormOptions,
  props: {
    title: 'Sign in',
  },
  render: ({ form, title }) => {
    return (
      <SigninFormContainer title={title}>
        <div className="flex flex-col gap-2">
          <form.AppField
            name="email"
            children={(field) => <field.SigninFormTextField label="Email" />}
          />
          <form.AppField
            name="password"
            children={(field) => <field.SigninFormTextField label="Password" />}
          />
        </div>
        <form.AppForm>
          <form.SigninFormSubmitButton label="Sign in" />
        </form.AppForm>
      </SigninFormContainer>
    );
  },
});

export function SigninForm() {
  const form = useSigninForm();

  return <SigninFormView form={form} title="Sign in" />;
}
