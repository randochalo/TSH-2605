"use client";

import { useEffect, useState } from "react";
import { useApi } from "./contexts/AuthContext";
import { DashboardCard } from "../components/DashboardCard";

interface DashboardStats {
  ems: {
    totalAssets: number;
    activeAssets: number;
    maintenanceAssets: number;
    pendingRepairs: number;
  };
  hrms: {
    totalEmployees: number;
    activeEmployees: number;
    newHiresThisMonth: number;
    onLeaveEmployees: number;
    pendingLeaveRequests: number;
    pendingClaims: number;
  };
  ps: {
    pendingPRs: number;
    totalVendors: number;
    openPOs: number;
    totalBudget: number;
    monthlySpending: number;
  };
  upcomingMaintenance: Array<{
    id: string;
    title: string;
    nextDueAt: string;
  }>;
  recentActivities: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function HomePage() {
  const { fetchWithAuth } = useApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Error loading dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
        <button 
          onClick={loadDashboardStats}
          className="ml-4 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s an overview of your enterprise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Assets"
          value={stats?.ems.totalAssets.toLocaleString() || "0"}
          subtitle={`${stats?.ems.activeAssets || 0} active`}
          trend="up"
          trendValue="Real-time data"
          icon="🔧"
          color="blue"
        />
        <DashboardCard
          title="Active PRs"
          value={stats?.ps.pendingPRs.toString() || "0"}
          subtitle="Pending approval"
          trend="neutral"
          trendValue="Procurement"
          icon="📦"
          color="green"
        />
        <DashboardCard
          title="Total Employees"
          value={stats?.hrms.totalEmployees.toLocaleString() || "0"}
          subtitle={`${stats?.hrms.activeEmployees || 0} active`}
          trend="up"
          trendValue={`${stats?.hrms.newHiresThisMonth || 0} new this month`}
          icon="👥"
          color="purple"
        />
        <DashboardCard
          title="Pending Tasks"
          value={((stats?.hrms.pendingLeaveRequests || 0) + (stats?.hrms.pendingClaims || 0)).toString()}
          subtitle="HR approvals needed"
          trend="neutral"
          trendValue="Action required"
          icon="📋"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Equipment Management</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Assets</span>
              <span className="font-medium">{stats?.ems.activeAssets || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Maintenance</span>
              <span className="font-medium text-yellow-600">{stats?.ems.maintenanceAssets || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Repairs</span>
              <span className="font-medium text-red-600">{stats?.ems.pendingRepairs || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Procurement</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Open POs</span>
              <span className="font-medium">{stats?.ps.openPOs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Vendors</span>
              <span className="font-medium">{stats?.ps.totalVendors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Spending</span>
              <span className="font-medium">RM {stats?.ps.monthlySpending.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Human Resources</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">On Leave</span>
              <span className="font-medium">{stats?.hrms.onLeaveEmployees || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Leave</span>
              <span className="font-medium text-yellow-600">{stats?.hrms.pendingLeaveRequests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Claims</span>
              <span className="font-medium text-orange-600">{stats?.hrms.pendingClaims || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Maintenance</h2>
          <div className="space-y-4">
            {stats?.upcomingMaintenance && stats.upcomingMaintenance.length > 0 ? (
              stats.upcomingMaintenance.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(item.nextDueAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming maintenance</p>
            )}
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
