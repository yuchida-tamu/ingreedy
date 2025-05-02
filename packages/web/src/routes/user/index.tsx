import { UnauthorizedError } from '@/features/user/apis/getUser';
import { getUserOptions, UserInfoCard } from '@/features/user/components/UserInfoSection';
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
          <UserInfoCard />
        </Suspense>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4 text-xl">Account Overview</h3>

                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Recipes Created</div>
                    <div className="stat-value">31</div>
                    <div className="stat-desc">↗︎ 40% more than last month</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Recipes Saved</div>
                    <div className="stat-value">120</div>
                    <div className="stat-desc">↗︎ 20% more than last month</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Account Status</div>
                    <div className="stat-value text-success">Active</div>
                    <div className="stat-desc">Member since Jan 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4 text-xl">Settings</h3>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email Notifications</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Public Profile</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Dark Mode</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>

                  <div className="divider"></div>

                  <button className="btn btn-outline btn-primary w-full">Edit Profile</button>

                  <button className="btn btn-outline btn-error w-full">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
