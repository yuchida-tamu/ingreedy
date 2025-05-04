import { UnauthorizedError } from '@/domains/apis/getUser';
import { getUserOptions, UserInfoSection } from '@/features/user/components/UserInfoSection';
import { UserOverviewSection } from '@/features/user/components/UserOverviewSection';
import { UserSettingsSection } from '@/features/user/components/UserSettingsSection';
import { createFileRoute, ErrorComponentProps, redirect } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/user/')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    return queryClient.fetchQuery(getUserOptions);
  },
  errorComponent: ErrorComponent,
  component: UserPage,
});

function ErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof UnauthorizedError) {
    throw redirect({
      to: '/auth',
      search: {
        redirect: location.href,
      },
    });
  }
  return <div>Something went wrong</div>;
}

function UserPage() {
  return (
    <div className="bg-base-200 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* User Profile Card */}
        <Suspense fallback={<div>Loading...</div>}>
          <UserInfoSection />
        </Suspense>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <UserOverviewSection />
          </div>

          {/* Settings Panel */}
          <div className="md:col-span-1">
            <UserSettingsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
