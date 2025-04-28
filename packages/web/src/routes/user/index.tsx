import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/user/')({
  beforeLoad: async ({ location, context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/user/"!</div>;
}
