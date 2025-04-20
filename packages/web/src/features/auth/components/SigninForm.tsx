import {
  signinFormOptions,
  withForm,
} from '@/features/auth/hooks/useSigninForm';

export const SigninForm = withForm({
  ...signinFormOptions,
  props: {
    title: 'Sign in',
  },
  render: ({ form, title }) => {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row bg-secondary-content rounded-lg">
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="max-w-sm rounded-lg"
          />
          <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex flex-col gap-2">
              <form.AppField
                name="email"
                children={(field) => <field.TextField label="Email" />}
              />
              <form.AppField
                name="password"
                children={(field) => <field.TextField label="Password" />}
              />
            </div>
            <form.AppForm>
              <form.SubmitButton label="Sign in" />
            </form.AppForm>
          </div>
        </div>
      </div>
    );
  },
});
