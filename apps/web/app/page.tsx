import { DashboardCard } from "../components/DashboardCard";

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your enterprise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Assets"
          value="1,247"
          subtitle="Across all locations"
          trend="up"
          trendValue="12% this month"
          icon="🔧"
          color="blue"
        />
        <DashboardCard
          title="Active PRs"
          value="28"
          subtitle="Pending approval"
          trend="down"
          trendValue="5 from last week"
          icon="📦"
          color="green"
        />
        <DashboardCard
          title="Total Employees"
          value="342"
          subtitle="Active staff"
          trend="up"
          trendValue="8 new hires"
          icon="👥"
          color="purple"
        />
        <DashboardCard
          title="Pending Tasks"
          value="15"
          subtitle="Require attention"
          trend="neutral"
          trendValue="No change"
          icon="📋"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New asset added", detail: "Dell Laptop XPS 15", time: "2 min ago", type: "ems" },
              { action: "Purchase order approved", detail: "PO-2024-0189", time: "15 min ago", type: "ps" },
              { action: "Leave request submitted", detail: "Sarah Johnson", time: "1 hour ago", type: "hrms" },
              { action: "Maintenance completed", detail: "HVAC System #42", time: "2 hours ago", type: "ems" },
              { action: "New vendor registered", detail: "ABC Supplies Ltd", time: "3 hours ago", type: "ps" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/ems/assets" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl">➕</span>
              <p className="font-medium mt-2">Add Asset</p>
            </a>
            <a href="/ps/requisitions" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl">📝</span>
              <p className="font-medium mt-2">Create PR</p>
            </a>
            <a href="/hrms/employees" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl">👤</span>
              <p className="font-medium mt-2">Add Employee</p>
            </a>
            <a href="/ems/maintenance" className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <span className="text-2xl">🔧</span>
              <p className="font-medium mt-2">Schedule Maintenance</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
