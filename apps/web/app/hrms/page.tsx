"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DashboardCard } from "../../components/DashboardCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  newHiresThisMonth: number;
  presentToday: number;
  onLeave: number;
  pendingClaims: number;
  openPositions: number;
  employeesByDepartment: Array<{ department: string; _count: { department: number } }>;
}

interface PendingApproval {
  id: string;
  type: string;
  employeeName: string;
  details: string;
  submittedAt: string;
}

export default function HRMSDashboard() {
  const { fetchWithAuth } = useApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, approvalsRes] = await Promise.all([
        fetchWithAuth("/api/dashboard/hrms"),
        fetchWithAuth("/api/dashboard/hrms/pending-approvals"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (approvalsRes.ok) {
        const approvalsData = await approvalsRes.json();
        setPendingApprovals(approvalsData);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const departmentData = stats?.employeesByDepartment?.map((d) => ({
    dept: d.department,
    count: d._count.department,
    percentage: Math.round((d._count.department / (stats?.totalEmployees || 1)) * 100),
  })) || [];

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
          value={stats?.totalEmployees || 0}
          subtitle="Active staff"
          trend="up"
          trendValue={`${stats?.newHiresThisMonth || 0} new this month`}
          icon="👥"
          color="blue"
        />
        <DashboardCard
          title="Present Today"
          value={stats?.presentToday || 0}
          subtitle={`${stats?.totalEmployees ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}% attendance`}
          trend="up"
          trendValue="Daily average"
          icon="✓"
          color="green"
        />
        <DashboardCard
          title="On Leave"
          value={stats?.onLeave || 0}
          subtitle="Today"
          trend="neutral"
          trendValue="Current"
          icon="🏖️"
          color="yellow"
        />
        <DashboardCard
          title="Open Positions"
          value={stats?.openPositions || 0}
          subtitle="Recruiting"
          trend="up"
          trendValue="Active requisitions"
          icon="📝"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Department Distribution</h2>
          <div className="space-y-4">
            {departmentData.length > 0 ? (
              departmentData.map((dept) => (
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
              ))
            ) : (
              <p className="text-gray-500">No department data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Approvals ({pendingApprovals.length})</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-sm">{item.type}</span>
                    <p className="text-xs text-gray-500">{item.employeeName}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-sm">{item.details}</span>
                    <p className="text-xs text-gray-500">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <a href="/hrms/employees" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">👤</span>
          <p className="font-medium mt-2">Employees</p>
          <p className="text-sm text-gray-500">{stats?.totalEmployees || 0} total</p>
        </a>
        <a href="/hrms/attendance" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📅</span>
          <p className="font-medium mt-2">Attendance</p>
          <p className="text-sm text-gray-500">{stats?.presentToday || 0} present</p>
        </a>
        <a href="/hrms/leave" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🏖️</span>
          <p className="font-medium mt-2">Leave</p>
          <p className="text-sm text-gray-500">{stats?.onLeave || 0} on leave</p>
        </a>
        <a href="/hrms/payroll" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">💵</span>
          <p className="font-medium mt-2">Payroll</p>
          <p className="text-sm text-gray-500">Process monthly</p>
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <a href="/hrms/claims" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🧾</span>
          <p className="font-medium mt-2">Claims</p>
          <p className="text-sm text-gray-500">{stats?.pendingClaims || 0} pending</p>
        </a>
        <a href="/hrms/performance" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📈</span>
          <p className="font-medium mt-2">Performance</p>
          <p className="text-sm text-gray-500">Reviews & goals</p>
        </a>
        <a href="/hrms/training" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">🎓</span>
          <p className="font-medium mt-2">Training</p>
          <p className="text-sm text-gray-500">Courses & enrollment</p>
        </a>
        <a href="/hrms/recruitment" className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
          <span className="text-2xl">📝</span>
          <p className="font-medium mt-2">Recruitment</p>
          <p className="text-sm text-gray-500">{stats?.openPositions || 0} open positions</p>
        </a>
      </div>
    </div>
  );
}
