import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from '@tanstack/react-form';

type SigninFormProps = {
  email: string;
  password: string;
};

const DEFAULT_VALUES: SigninFormProps = {
  email: '',
  password: '',
};

export const signinFormOptions = formOptions({
  defaultValues: DEFAULT_VALUES,
});

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <label className="label justify-between">
      <span>{label}</span>
      <input
        className="input"
        placeholder={label}
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
          className="btn btn-accent rounded-md"
          type="submit"
          disabled={isSubmitting}
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
