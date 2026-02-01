import { DashboardCard } from "../../components/DashboardCard";
import { DataTable } from "../../components/DataTable";

const budgetsData = [
  { department: "IT", allocated: "$500,000", spent: "$420,000", remaining: "$80,000", utilization: 84 },
  { department: "HR", allocated: "$150,000", spent: "$125,400", remaining: "$24,600", utilization: 84 },
  { department: "Production", allocated: "$2,000,000", spent: "$1,850,000", remaining: "$150,000", utilization: 93 },
  { department: "Marketing", allocated: "$300,000", spent: "$245,000", remaining: "$55,000", utilization: 82 },
  { department: "Operations", allocated: "$800,000", spent: "$720,000", remaining: "$80,000", utilization: 90 },
  { department: "R&D", allocated: "$400,000", spent: "$280,000", remaining: "$120,000", utilization: 70 },
];

export default function BudgetsPage() {
  const columns = [
    { key: "department", header: "Department" },
    { key: "allocated", header: "Budget Allocated" },
    { key: "spent", header: "Spent" },
    { key: "remaining", header: "Remaining" },
    {
      key: "utilization",
      header: "Utilization",
      render: (item: typeof budgetsData[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                item.utilization > 90 ? "bg-red-600" : item.utilization > 80 ? "bg-yellow-500" : "bg-green-600"
              }`}
              style={{ width: `${item.utilization}%` }}
            />
          </div>
          <span className="text-sm">{item.utilization}%</span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget Control</h1>
          <p className="text-gray-500">Monitor departmental budgets and spending</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          📥 Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Budget"
          value="$4.15M"
          color="blue"
        />
        <DashboardCard
          title="Spent YTD"
          value="$3.64M"
          color="green"
        />
        <DashboardCard
          title="Remaining"
          value="$509K"
          color="yellow"
        />
        <DashboardCard
          title="Avg Utilization"
          value="84%"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Budget by Department</h2>
        <DataTable columns={columns} data={budgetsData} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Budget Alerts</h2>
          <div className="space-y-3">
            {[
              { dept: "Production", message: "Budget utilization above 90%", severity: "warning" },
              { dept: "Operations", message: "Budget utilization above 90%", severity: "warning" },
              { dept: "IT", message: "Large purchase pending approval", severity: "info" },
            ].map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${alert.severity === "warning" ? "bg-yellow-50" : "bg-blue-50"}`}>
                <p className="font-medium text-sm">{alert.dept}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Spending Categories</h2>
          <div className="space-y-4">
            {[
              { category: "Raw Materials", amount: "$1.85M", percentage: 51 },
              { category: "IT Equipment", amount: "$420K", percentage: 12 },
              { category: "Services", amount: "$380K", percentage: 10 },
              { category: "Office Supplies", amount: "$245K", percentage: 7 },
            ].map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-gray-500">{cat.amount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
