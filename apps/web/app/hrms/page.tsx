import { DashboardCard } from "../../components/DashboardCard";

export default function HRMSDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Human Resource Management</h1>
          <p className="text-gray-500">Manage employees, attendance, payroll, and more</p>
        </div>
        <a
          href="/hrms/employees"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Employee
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Employees"
          value="342"
          subtitle="Active staff"
          trend="up"
          trendValue="8 new this month"
          icon="👥"
          color="blue"
        />
        <DashboardCard
          title="Present Today"
          value="318"
          subtitle="93% attendance"
          trend="up"
          trendValue="2% from yesterday"
          icon="✓"
          color="green"
        />
        <DashboardCard
          title="On Leave"
          value="24"
          subtitle="Today"
          trend="neutral"
          trendValue="Average"
          icon="🏖️"
          color="yellow"
        />
        <DashboardCard
          title="Open Positions"
          value="12"
          subtitle="Recruiting"
          trend="down"
          trendValue="3 filled"
          icon="📝"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Department Distribution</h2>
          <div className="space-y-4">
            {[
              { dept: "Production", count: 120, percentage: 35 },
              { dept: "IT", count: 45, percentage: 13 },
              { dept: "Sales & Marketing", count: 38, percentage: 11 },
              { dept: "Operations", count: 42, percentage: 12 },
              { dept: "HR & Admin", count: 25, percentage: 7 },
              { dept: "R&D", count: 32, percentage: 9 },
              { dept: "Finance", count: 20, percentage: 6 },
              { dept: "Others", count: 20, percentage: 6 },
            ].map((dept) => (
              <div key={dept.dept}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{dept.dept}</span>
                  <span className="text-sm text-gray-500">{dept.count} ({dept.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
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
              { type: "Leave Request", employee: "John Smith", date: "Jan 25-28", days: "3 days" },
              { type: "Expense Claim", employee: "Sarah Chen", date: "$450", days: "Submitted today" },
              { type: "Overtime", employee: "Mike Johnson", date: "5 hours", days: "Yesterday" },
              { type: "Leave Request", employee: "Lisa Wang", date: "Feb 1-3", days: "2 days" },
              { type: "Expense Claim", employee: "David Lee", date: "$1,250", days: "2 days ago" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-sm">{item.type}</span>
                  <p className="text-xs text-gray-500">{item.employee}</p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-sm">{item.date}</span>
                  <p className="text-xs text-gray-500">{item.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <a href="/hrms/employees" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">👤</span>
          <p className="font-medium mt-2">Employees</p>
        </a>
        <a href="/hrms/attendance" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📅</span>
          <p className="font-medium mt-2">Attendance</p>
        </a>
        <a href="/hrms/leave" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🏖️</span>
          <p className="font-medium mt-2">Leave</p>
        </a>
        <a href="/hrms/payroll" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">💵</span>
          <p className="font-medium mt-2">Payroll</p>
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <a href="/hrms/claims" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🧾</span>
          <p className="font-medium mt-2">Claims</p>
        </a>
        <a href="/hrms/performance" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📈</span>
          <p className="font-medium mt-2">Performance</p>
        </a>
        <a href="/hrms/training" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🎓</span>
          <p className="font-medium mt-2">Training</p>
        </a>
        <a href="/hrms/recruitment" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📝</span>
          <p className="font-medium mt-2">Recruitment</p>
        </a>
      </div>
    </div>
  );
}
