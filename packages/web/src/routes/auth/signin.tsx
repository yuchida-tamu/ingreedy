import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <label className="label justify-between">
      <span>{label}</span>
      <input
        className="input"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          className="btn btn-accent"
          type="submit"
          disabled={isSubmitting}
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

type SigninFormProps = {
  email: string;
  password: string;
};

const DEFAULT_VALUES: SigninFormProps = {
  email: '',
  password: '',
};

const options = formOptions({
  defaultValues: DEFAULT_VALUES,
});

const SigninForm = withForm({
  ...options,
  props: {
    title: 'Sign in',
  },
  render: ({ form, title }) => {
    return (
      <div className="hero">
        <div className="hero-content text-center">
          <div className="join join-vertical gap-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <form.AppField
              name="email"
              children={(field) => <field.TextField label="Email" />}
            />
            <form.AppField
              name="password"
              children={(field) => <field.TextField label="Password" />}
            />
            <form.AppForm>
              <form.SubmitButton label="Sign in" />
            </form.AppForm>
          </div>
        </div>
      </div>
    );
  },
});

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    ...options,
  });

  return <SigninForm title="Sign in" form={form} />;
}
