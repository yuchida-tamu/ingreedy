export function UserSettingsSection() {
  return (
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
  );
}
