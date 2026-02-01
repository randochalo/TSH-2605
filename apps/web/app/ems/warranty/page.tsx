"use client";

import { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { DataTable } from "../../../components/DataTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface Warranty {
  id: string;
  warrantyNumber: string;
  warrantyType: string;
  provider: string;
  startDate: string;
  endDate: string;
  coverage: string;
  terms: string;
  asset: {
    assetNumber: string;
    name: string;
    category: { name: string };
  };
}

interface WarrantiesResponse {
  data: Warranty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getDaysUntilExpiry(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getWarrantyStatus(daysLeft: number): { status: string; color: string } {
  if (daysLeft < 0) return { status: "Expired", color: "bg-red-100 text-red-800" };
  if (daysLeft < 90) return { status: "Expiring Soon", color: "bg-yellow-100 text-yellow-800" };
  return { status: "Active", color: "bg-green-100 text-green-800" };
}

export default function WarrantyPage() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");

  const { data: response, loading, error } = useApi<WarrantiesResponse>(
    `/api/assets?page=${page}&limit=20`
  );

  // For now, we'll show warranties as part of assets
  // In a real app, you'd have a dedicated /api/warranties endpoint
  const assets = response?.data || [];
  const pagination = response?.pagination;

  // Calculate warranty stats
  let activeCount = 0;
  let expiringCount = 0;
  let expiredCount = 0;

  const warrantyData = assets.flatMap(asset => 
    (asset as any).warranties?.map((w: Warranty) => {
      const daysLeft = getDaysUntilExpiry(w.endDate);
      const status = getWarrantyStatus(daysLeft);
      
      if (status.status === "Active") activeCount++;
      else if (status.status === "Expiring Soon") expiringCount++;
      else expiredCount++;

      return {
        ...w,
        assetName: asset.name,
        assetNumber: (asset as any).assetNumber,
        daysLeft,
        status: status.status,
        statusColor: status.color,
      };
    }) || []
  );

  const filteredData = warrantyData.filter(w => {
    if (!filterStatus) return true;
    return w.status === filterStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-MY");
  };

  const columns = [
    { key: "warrantyNumber", header: "Warranty ID" },
    {
      key: "assetName",
      header: "Asset",
      render: (item: any) => (
        <div>
          <div className="font-medium">{item.assetName}</div>
          <div className="text-xs text-gray-500">{item.assetNumber}</div>
        </div>
      ),
    },
    { key: "provider", header: "Provider" },
    {
      key: "startDate",
      header: "Start Date",
      render: (item: Warranty) => formatDate(item.startDate),
    },
    {
      key: "endDate",
      header: "Expiry Date",
      render: (item: Warranty) => formatDate(item.endDate),
    },
    {
      key: "daysLeft",
      header: "Days Left",
      render: (item: any) => (
        <span className={item.daysLeft < 0 ? "text-red-600 font-medium" : item.daysLeft < 90 ? "text-yellow-600 font-medium" : ""}>
          {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days ago` : `${item.daysLeft} days`}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.statusColor}`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Warranty Tracking</h1>
          <p className="text-gray-500">Monitor asset warranties and coverage</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Warranty
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Active Warranties</p>
          <p className="text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Expiring Soon (90d)</p>
          <p className="text-2xl font-bold">{expiringCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl font-bold">{expiredCount}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Warranties</p>
          <p className="text-2xl font-bold">{warrantyData.length}</p>
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
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading warranties: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={filteredData} />
          
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
