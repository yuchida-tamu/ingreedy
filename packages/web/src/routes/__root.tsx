import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

type RootContext = {
  auth: {
    isAuthenticated: boolean;
  };
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/auth" className="[&.active]:font-bold">
          Auth
        </Link>
        <Link to="/user" className="[&.active]:font-bold">
          User
        </Link>
        <Link to="/auth/signout" className="[&.active]:font-bold">
          Signout
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
