"use client";

import { useApi } from "../../hooks/useApi";
import { DashboardCard } from "../../components/DashboardCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface PRStats {
  totalPRs: number;
  byStatus: { status: string; _count: { status: number } }[];
  pendingApproval: number;
  totalAmount: number;
}

interface POStats {
  totalPOs: number;
  byStatus: { status: string; _count: { status: number } }[];
  totalValue: number;
  avgOrderValue: number;
}

interface VendorStats {
  totalVendors: number;
  byStatus: { status: string; _count: { status: number } }[];
}

export default function PSDashboard() {
  const { data: prStats, loading: prLoading } = useApi<PRStats>("/api/requisitions/stats/overview");
  const { data: poStats, loading: poLoading } = useApi<POStats>("/api/orders/stats/overview");
  const { data: vendorStats, loading: vendorLoading } = useApi<VendorStats>("/api/vendors/stats/overview");
  const { data: recentPRs } = useApi("/api/requisitions?limit=5");

  const loading = prLoading || poLoading || vendorLoading;

  const getStatusCount = (stats: any[], status: string) => {
    return stats?.find(s => s.status === status)?._count?.status || 0;
  };

  const formatCurrency = (value: number) => {
    if (!value) return "RM 0";
    if (value >= 1000000) return `RM ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `RM ${(value / 1000).toFixed(0)}K`;
    return `RM ${value}`;
  };

  const pendingPRs = prStats?.pendingApproval || 0;
  const activePOs = getStatusCount(poStats?.byStatus || [], "SENT_TO_VENDOR") + 
                   getStatusCount(poStats?.byStatus || [], "PARTIALLY_RECEIVED");
  const approvedVendors = getStatusCount(vendorStats?.byStatus || [], "ACTIVE");
  const ytdSpend = poStats?.totalValue || 0;

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
          value={pendingPRs.toString()}
          subtitle="Awaiting approval"
          trend="neutral"
          trendValue="Needs attention"
          icon="📝"
          color="yellow"
        />
        <DashboardCard
          title="Active POs"
          value={activePOs.toString()}
          subtitle="In progress"
          trend="up"
          trendValue="On track"
          icon="📄"
          color="blue"
        />
        <DashboardCard
          title="Approved Vendors"
          value={approvedVendors.toString()}
          subtitle="Active suppliers"
          trend="up"
          trendValue="Available"
          icon="🏢"
          color="green"
        />
        <DashboardCard
          title="YTD Spend"
          value={formatCurrency(ytdSpend)}
          subtitle="Total purchase value"
          trend="neutral"
          trendValue="All departments"
          icon="💰"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Spend by Category</h2>
          <div className="space-y-4">
            {[
              { category: "Vehicles & Equipment", amount: poStats?.totalValue ? poStats.totalValue * 0.35 : 0, percentage: 35 },
              { category: "Parts & Supplies", amount: poStats?.totalValue ? poStats.totalValue * 0.26 : 0, percentage: 26 },
              { category: "Fuel", amount: poStats?.totalValue ? poStats.totalValue * 0.14 : 0, percentage: 14 },
              { category: "Services", amount: poStats?.totalValue ? poStats.totalValue * 0.12 : 0, percentage: 12 },
              { category: "Maintenance", amount: poStats?.totalValue ? poStats.totalValue * 0.13 : 0, percentage: 13 },
            ].map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
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
          <h2 className="text-lg font-semibold mb-4">Recent Purchase Requisitions</h2>
          <div className="space-y-3">
            {recentPRs && Array.isArray(recentPRs.data) && recentPRs.data.length > 0 ? (
              recentPRs.data.slice(0, 5).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-sm">{item.prNumber}</span>
                    <p className="text-xs text-gray-500">{item.requestorName} • {item.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-sm">{formatCurrency(item.totalAmount)}</span>
                    <p className="text-xs text-gray-500">{item.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent requisitions
              </div>
            )}
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
