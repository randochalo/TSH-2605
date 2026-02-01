import { DashboardCard } from "../../components/DashboardCard";

export default function PSDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Procurement System</h1>
          <p className="text-gray-500">Manage purchase requisitions, orders, and vendors</p>
        </div>
        <a
          href="/ps/requisitions"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Requisition
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Pending PRs"
          value="28"
          subtitle="Awaiting approval"
          trend="down"
          trendValue="5 from last week"
          icon="📝"
          color="yellow"
        />
        <DashboardCard
          title="Active POs"
          value="156"
          subtitle="In progress"
          trend="up"
          trendValue="12 new this week"
          icon="📄"
          color="blue"
        />
        <DashboardCard
          title="Approved Vendors"
          value="89"
          subtitle="Active suppliers"
          trend="up"
          trendValue="3 added recently"
          icon="🏢"
          color="green"
        />
        <DashboardCard
          title="YTD Spend"
          value="$2.4M"
          subtitle="84% of budget"
          trend="up"
          trendValue="On track"
          icon="💰"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Spend by Category</h2>
          <div className="space-y-4">
            {[
              { category: "IT Equipment", amount: "$850K", percentage: 35 },
              { category: "Raw Materials", amount: "$620K", percentage: 26 },
              { category: "Office Supplies", amount: "$340K", percentage: 14 },
              { category: "Services", amount: "$290K", percentage: 12 },
              { category: "Maintenance", amount: "$300K", percentage: 13 },
            ].map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-gray-500">{cat.amount} ({cat.percentage}%)</span>
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
          <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {[
              { id: "PR-2024-0156", requestor: "John Smith", amount: "$12,500", date: "Today" },
              { id: "PR-2024-0155", requestor: "Sarah Chen", amount: "$8,200", date: "Today" },
              { id: "PR-2024-0154", requestor: "Mike Johnson", amount: "$25,000", date: "Yesterday" },
              { id: "PR-2024-0153", requestor: "Lisa Wang", amount: "$3,450", date: "Yesterday" },
              { id: "PR-2024-0152", requestor: "David Lee", amount: "$18,900", date: "2 days ago" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-sm">{item.id}</span>
                  <p className="text-xs text-gray-500">{item.requestor}</p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-sm">{item.amount}</span>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <a href="/ps/requisitions" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📝</span>
          <p className="font-medium mt-2">Requisitions</p>
        </a>
        <a href="/ps/vendors" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🏢</span>
          <p className="font-medium mt-2">Vendors</p>
        </a>
        <a href="/ps/quotations" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📋</span>
          <p className="font-medium mt-2">Quotations</p>
        </a>
        <a href="/ps/orders" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📄</span>
          <p className="font-medium mt-2">Purchase Orders</p>
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/ps/receipts" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📦</span>
          <p className="font-medium mt-2">Goods Receipts</p>
        </a>
        <a href="/ps/matching" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">✓</span>
          <p className="font-medium mt-2">3-Way Matching</p>
        </a>
        <a href="/ps/budgets" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">💰</span>
          <p className="font-medium mt-2">Budget Control</p>
        </a>
      </div>
    </div>
  );
}
