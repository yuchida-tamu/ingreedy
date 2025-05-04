import { signoutFetcher } from '@/domains/apis/signout';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
export const Route = createFileRoute('/auth/signout')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
});

function RouteComponent() {
  const navigation = useNavigate();
  const { handleUnauthenticated } = useAuth();
  const { mutate } = useMutation({
    mutationFn: signoutFetcher,
  });

  const handleSignout = () => {
    mutate();
    handleUnauthenticated();
    navigation({ to: '/auth' });
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handleSignout}>
        Signout
      </button>
    </div>
  );
}
