"use client";

import { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { DataTable } from "../../../components/DataTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface MaintenanceRecord {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  scheduledStartAt: string;
  actualStartAt: string;
  actualEndAt: string;
  laborHours: number;
  totalCost: number;
  asset: {
    assetNumber: string;
    name: string;
    category: { name: string };
  };
}

interface MaintenanceResponse {
  data: MaintenanceRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface MaintenanceStats {
  totalRecords: number;
  byStatus: { status: string; _count: { status: number } }[];
  completedThisMonth: number;
  overdueSchedules: number;
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  ON_HOLD: "bg-orange-100 text-orange-800",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const queryParams = new URLSearchParams();
  if (filterStatus) queryParams.set("status", filterStatus);
  if (filterPriority) queryParams.set("priority", filterPriority);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data: response, loading, error } = useApi<MaintenanceResponse>(
    `/api/maintenance?${queryParams.toString()}`
  );
  const { data: stats } = useApi<MaintenanceStats>("/api/maintenance/stats/overview");

  const records = response?.data || [];
  const pagination = response?.pagination;

  const getStatusCount = (status: string) => {
    return stats?.byStatus.find(s => s.status === status)?._count.status || 0;
  };

  const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString("en-MY") : "-";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const columns = [
    { key: "workOrderNumber", header: "WO Number" },
    {
      key: "asset",
      header: "Asset",
      render: (item: MaintenanceRecord) => (
        <div>
          <div className="font-medium">{item.asset?.name}</div>
          <div className="text-xs text-gray-500">{item.asset?.assetNumber}</div>
        </div>
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "priority",
      header: "Priority",
      render: (item: MaintenanceRecord) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[item.priority] || "bg-gray-100"}`}>
          {item.priority}
        </span>
      ),
    },
    {
      key: "scheduledStartAt",
      header: "Scheduled",
      render: (item: MaintenanceRecord) => formatDate(item.scheduledStartAt),
    },
    {
      key: "status",
      header: "Status",
      render: (item: MaintenanceRecord) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100"}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "totalCost",
      header: "Cost",
      render: (item: MaintenanceRecord) => formatCurrency(item.totalCost),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
          <p className="text-gray-500">Track preventive and scheduled maintenance</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Schedule Maintenance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold">{getStatusCount("SCHEDULED")}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold">{getStatusCount("IN_PROGRESS")}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Completed (This Month)</p>
          <p className="text-2xl font-bold">{stats?.completedThisMonth || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold">{stats?.overdueSchedules || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading maintenance records: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={records} />
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} - {" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} records
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
