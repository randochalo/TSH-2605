import { DashboardCard } from "../../components/DashboardCard";

export default function EMSDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipment Management</h1>
          <p className="text-gray-500">Track assets, maintenance, and repairs</p>
        </div>
        <a
          href="/ems/assets"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Asset
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Assets"
          value="1,247"
          subtitle="Across all locations"
          trend="up"
          trendValue="12% this year"
          icon="🔧"
          color="blue"
        />
        <DashboardCard
          title="Due for Maintenance"
          value="18"
          subtitle="This month"
          trend="up"
          trendValue="3 more than last"
          icon="⚠️"
          color="yellow"
        />
        <DashboardCard
          title="Active Repairs"
          value="7"
          subtitle="In progress"
          trend="down"
          trendValue="2 completed"
          icon="🔨"
          color="red"
        />
        <DashboardCard
          title="Warranty Expiring"
          value="12"
          subtitle="Within 30 days"
          trend="neutral"
          trendValue="Check details"
          icon="📜"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Assets by Category</h2>
          <div className="space-y-4">
            {[
              { category: "IT Equipment", count: 456, percentage: 37 },
              { category: "Machinery", count: 324, percentage: 26 },
              { category: "Furniture", count: 234, percentage: 19 },
              { category: "Vehicles", count: 123, percentage: 10 },
              { category: "Others", count: 110, percentage: 8 },
            ].map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-gray-500">{cat.count} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Maintenance</h2>
          <div className="space-y-3">
            {[
              { asset: "Server Room AC", date: "Tomorrow", type: "Preventive" },
              { asset: "CNC Machine #3", date: "In 3 days", type: "Scheduled" },
              { asset: "Forklift #12", date: "Next week", type: "Inspection" },
              { asset: "UPS System B", date: "Next week", type: "Preventive" },
              { asset: "Air Compressor", date: "In 2 weeks", type: "Service" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.asset}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <a href="/ems/assets" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📋</span>
          <p className="font-medium mt-2">Asset List</p>
        </a>
        <a href="/ems/maintenance" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🔧</span>
          <p className="font-medium mt-2">Maintenance</p>
        </a>
        <a href="/ems/repairs" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🔨</span>
          <p className="font-medium mt-2">Repairs</p>
        </a>
        <a href="/ems/warranty" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📜</span>
          <p className="font-medium mt-2">Warranty</p>
        </a>
        <a href="/ems/spare-parts" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">⚙️</span>
          <p className="font-medium mt-2">Spare Parts</p>
        </a>
      </div>
    </div>
  );
}
