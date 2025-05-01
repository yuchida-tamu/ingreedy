import { useAuth } from '@/features/auth/context/AuthContext';
import { QueryClient } from '@tanstack/react-query';
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
type RootContext = {
  auth: {
    isAuthenticated: boolean;
  };
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/user" className="[&.active]:font-bold">
              User
            </Link>
            <Link to="/auth/signout" className="[&.active]:font-bold">
              Signout
            </Link>
          </>
        ) : (
          <Link to="/auth" className="[&.active]:font-bold">
            Signin
          </Link>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
