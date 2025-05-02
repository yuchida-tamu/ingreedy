import { getUserFetcher } from '@/features/user/apis/getUser';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

export const getUserOptions = queryOptions({
  queryKey: ['user'],
  queryFn: getUserFetcher,
});

export function UserInfoSection() {
  const { data } = useSuspenseQuery(getUserOptions);

  return (
    <div className="card bg-base-100 mb-8 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="flex justify-center text-3xl font-bold">
                {data.username.slice(0, 2)}
              </span>
            </div>
          </div>
          <div>
            <h2 className="card-title text-2xl">{data.username}</h2>
            <p className="text-base-content/70">{data.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
