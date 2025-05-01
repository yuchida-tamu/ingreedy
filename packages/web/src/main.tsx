import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { routeTree } from '@/routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
    },
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { isAuthenticated } = useAuth();
  return <RouterProvider router={router} context={{ auth: { isAuthenticated } }} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
