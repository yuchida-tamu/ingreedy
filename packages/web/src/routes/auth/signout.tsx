import { signoutMutation } from '@/apis/signout';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
export const Route = createFileRoute('/auth/signout')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  const navigation = useNavigate();
  const { mutate } = useMutation({
    mutationFn: signoutMutation,
  });

  const handleSignout = () => {
    mutate();
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
