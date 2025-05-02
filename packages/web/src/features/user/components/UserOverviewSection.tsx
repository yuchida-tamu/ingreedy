export function UserOverviewSection() {
  return (
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
  );
}
