import { SigninForm } from '@/features/auth/components/SigninForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/signin')({
  component: SigninForm,
});
