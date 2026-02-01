"use client";

import { useApi } from "../../hooks/useApi";
import { DashboardCard } from "../../components/DashboardCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface AssetStats {
  totalAssets: number;
  assetsByStatus: { status: string; _count: { status: number } }[];
  assetsByCategory: { categoryId: string; _count: { categoryId: number } }[];
  recentAssets: {
    id: string;
    assetNumber: string;
    name: string;
    category: { name: string };
    status: string;
  }[];
}

interface MaintenanceStats {
  totalRecords: number;
  byStatus: { status: string; _count: { status: number } }[];
  byPriority: { priority: string; _count: { priority: number } }[];
  completedThisMonth: number;
  overdueSchedules: number;
}

interface RepairStats {
  totalRepairs: number;
  openRepairs: number;
  byStatus: { status: string; _count: { status: number } }[];
}

export default function EMSDashboard() {
  const { data: assetStats, loading: assetsLoading } = useApi<AssetStats>("/api/assets/stats/overview");
  const { data: maintStats, loading: maintLoading } = useApi<MaintenanceStats>("/api/maintenance/stats/overview");
  const { data: repairStats, loading: repairsLoading } = useApi<RepairStats>("/api/repairs/stats/overview");
  const { data: upcomingMaint } = useApi("/api/maintenance/upcoming");

  const loading = assetsLoading || maintLoading || repairsLoading;

  // Calculate stats from API data
  const totalAssets = assetStats?.totalAssets || 0;
  const maintenanceCount = maintStats?.byStatus.find(s => s.status === "SCHEDULED")?._count.status || 0;
  const activeRepairs = repairStats?.openRepairs || 0;
  const completedThisMonth = maintStats?.completedThisMonth || 0;

  // Category breakdown
  const categoryNames: Record<string, string> = {
    "cat-1": "Prime Movers",
    "cat-2": "Trailers", 
    "cat-3": "Forklifts",
    "cat-4": "Cranes",
    "cat-5": "Container Handling",
    "cat-6": "Vehicles",
    "cat-7": "Equipment",
  };

  const assetsByCategory = assetStats?.assetsByCategory?.map(cat => ({
    category: categoryNames[cat.categoryId] || "Other",
    count: cat._count.categoryId,
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

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
          value={totalAssets.toLocaleString()}
          subtitle="Across all locations"
          trend="up"
          trendValue="Active fleet"
          icon="🔧"
          color="blue"
        />
        <DashboardCard
          title="Due for Maintenance"
          value={maintStats?.overdueSchedules || 0}
          subtitle="Overdue schedules"
          trend="up"
          trendValue="Needs attention"
          icon="⚠️"
          color="yellow"
        />
        <DashboardCard
          title="Active Repairs"
          value={activeRepairs}
          subtitle="In progress"
          trend="neutral"
          trendValue={`${completedThisMonth} completed this month`}
          icon="🔨"
          color="red"
        />
        <DashboardCard
          title="Completed Maintenance"
          value={completedThisMonth}
          subtitle="This month"
          trend="up"
          trendValue="On track"
          icon="📜"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Assets by Category</h2>
          <div className="space-y-4">
            {assetsByCategory.length > 0 ? (
              assetsByCategory.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm text-gray-500">{cat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((cat.count / totalAssets) * 100 * assetsByCategory.length, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Maintenance</h2>
          <div className="space-y-3">
            {upcomingMaint && Array.isArray(upcomingMaint) && upcomingMaint.length > 0 ? (
              upcomingMaint.slice(0, 5).map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.nextDueAt ? new Date(item.nextDueAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming maintenance
              </div>
            )}
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
