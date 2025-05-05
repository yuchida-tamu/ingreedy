import { Debug } from '@/elements/debugs/Debug';
import { useDebugAuthButton } from '@/features/auth/hooks/useDebugAuthButton';

export function DebugSigninButton() {
  const { submit } = useDebugAuthButton('signin');

  return (
    <Debug>
      <button className="btn btn-outline" onClick={submit}>
        Debug Signin
      </button>
    </Debug>
  );
}
