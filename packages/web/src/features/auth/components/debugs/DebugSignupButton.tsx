import { Debug } from '@/elements/debugs/Debug';
import { useDebugAuthButton } from '@/features/auth/hooks/useDebugAuthButton';

export function DebugSignupButton() {
  const { submit } = useDebugAuthButton('signup');

  return (
    <Debug>
      <button className="btn btn-outline" onClick={submit}>
        Debug Signup
      </button>
    </Debug>
  );
}
