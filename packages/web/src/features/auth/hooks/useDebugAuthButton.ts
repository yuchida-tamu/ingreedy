import { signinFetcher } from '@/domains/apis/signin';
import { signupFetcher } from '@/domains/apis/signup';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { flushSync } from 'react-dom';

export function useDebugAuthButton(type: 'signin' | 'signup') {
  const navigate = useNavigate();
  const { handleAuthenticated } = useAuth();
  const { mutate: signinMutation } = useMutation({
    mutationFn: signinFetcher,
    onError: () => {
      navigate({ to: '/auth' });
    },
  });
  const { mutate: signupMutation } = useMutation({
    mutationFn: signupFetcher,
    onError: () => {
      navigate({ to: '/auth' });
    },
  });

  const signin = useCallback(() => {
    signinMutation({
      email: import.meta.env.VITE_DEBUG_EMAIL as string,
      password: import.meta.env.VITE_DEBUG_PASSWORD as string,
    });
  }, [signinMutation]);

  const signup = useCallback(() => {
    signupMutation({
      email: import.meta.env.VITE_DEBUG_EMAIL as string,
      password: import.meta.env.VITE_DEBUG_PASSWORD as string,
      username: import.meta.env.VITE_DEBUG_USERNAME as string,
    });
  }, [signupMutation]);

  const submit = useCallback(() => {
    if (type === 'signin') {
      signin();
    } else {
      signup();
    }
    flushSync(() => {
      handleAuthenticated();
      navigate({ to: '/user' });
    });
  }, [type, signin, signup, navigate, handleAuthenticated]);
  return {
    submit,
  };
}
