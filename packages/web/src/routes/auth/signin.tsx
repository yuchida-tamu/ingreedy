import { SigninForm } from '@/features/auth/components/SigninForm';
import {
  signinFormOptions,
  useAppForm,
} from '@/features/auth/hooks/useSigninForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    ...signinFormOptions,
  });

  return <SigninForm title="Sign in" form={form} />;
}
