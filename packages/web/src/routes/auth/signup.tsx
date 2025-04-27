import { SignupForm } from '@/features/auth/components/SignupForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/signup')({
  component: SignupForm,
});
