import { getUserInventoriesFetcher } from '@/domains/apis/getUserInventories';
import { useQuery } from '@tanstack/react-query';

function useUserInventoryCount() {
  const { data: inventories } = useQuery({
    queryKey: ['user-inventories'],
    queryFn: getUserInventoriesFetcher,
  });

  return inventories?.data.length ?? 0;
}

export function UserOverviewSection() {
  const inventoryCount = useUserInventoryCount();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title mb-4 text-xl">Account Overview</h3>

        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">Active Inventory</div>
            <div className="stat-value">
              {inventoryCount} <span className="text-xs">items</span>
            </div>
            <div className="stat-desc">↗︎ milk is expiring soon</div>
          </div>

          <div className="stat">
            <div className="stat-title">Your Recipes</div>
            <div className="stat-value">10</div>
            <div className="stat-desc">↗︎ 20% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-title">Recipes Saved</div>
            <div className="stat-value">120</div>
            <div className="stat-desc">↗︎ 20% more than last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
