import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from '@tanstack/react-form';

const {
  fieldContext: signinFieldContext,
  useFieldContext: useSigninFieldContext,
  formContext: signinFormContext,
  useFormContext: useSigninFormContext,
} = createFormHookContexts();

type SigninFormProps = {
  email: string;
  password: string;
};

function SigninFormTextField({ label }: { label: string }) {
  const field = useSigninFieldContext<string>();

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

function SigninFormSubmitButton({ label }: { label: string }) {
  const form = useSigninFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          className="btn btn-primary rounded-md"
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
    SigninFormTextField,
  },
  formComponents: {
    SigninFormSubmitButton,
  },
  fieldContext: signinFieldContext,
  formContext: signinFormContext,
});

export const withSigninForm = withForm;

export const signinFormOptions = formOptions({
  defaultValues: {
    email: '',
    password: '',
  } as const satisfies SigninFormProps,
});

export const useSigninForm = () => {
  const form = useAppForm(signinFormOptions);

  return form;
};
