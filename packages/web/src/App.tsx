import { useAuth } from '@/features/auth/context/AuthContext';
import { routeTree } from '@/routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const { isAuthenticated } = useAuth();
  return <RouterProvider router={router} context={{ auth: { isAuthenticated } }} />;
}
