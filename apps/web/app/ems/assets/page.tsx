"use client";

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  category: { name: string };
  location: { name: string };
  branch: { name: string };
  status: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  condition: string;
  _count: {
    maintenanceRecords: number;
    repairOrders: number;
  };
}

interface AssetsResponse {
  data: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  MAINTENANCE: "bg-yellow-100 text-yellow-800",
  REPAIR: "bg-red-100 text-red-800",
  RETIRED: "bg-gray-100 text-gray-800",
  DISPOSED: "bg-gray-100 text-gray-800",
};

const conditionColors: Record<string, string> = {
  EXCELLENT: "bg-green-100 text-green-800",
  GOOD: "bg-blue-100 text-blue-800",
  FAIR: "bg-yellow-100 text-yellow-800",
  POOR: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

export default function AssetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set("search", searchQuery);
  if (filterStatus) queryParams.set("status", filterStatus);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data: response, loading, error } = useApi<AssetsResponse>(
    `/api/assets?${queryParams.toString()}`
  );

  const assets = response?.data || [];
  const pagination = response?.pagination;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-MY");
  };

  const columns = [
    { key: "assetNumber", header: "Asset ID" },
    { key: "name", header: "Name" },
    {
      key: "category",
      header: "Category",
      render: (item: Asset) => item.category?.name || "-",
    },
    {
      key: "location",
      header: "Location",
      render: (item: Asset) => item.location?.name || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Asset) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100"}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "condition",
      header: "Condition",
      render: (item: Asset) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${conditionColors[item.condition] || "bg-gray-100"}`}>
          {item.condition}
        </span>
      ),
    },
    {
      key: "acquisitionDate",
      header: "Purchase Date",
      render: (item: Asset) => formatDate(item.acquisitionDate),
    },
    {
      key: "currentValue",
      header: "Current Value",
      render: (item: Asset) => formatCurrency(item.currentValue),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assets</h1>
          <p className="text-gray-500">Manage your equipment and assets</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="REPAIR">Repair</option>
          <option value="RETIRED">Retired</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading assets: {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={assets}
            onRowClick={(item) => window.location.href = `/ems/assets/${item.id}`}
          />
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} - {" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} assets
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

      {/* Add Asset Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Asset"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>IT Equipment</option>
                <option>Machinery</option>
                <option>Furniture</option>
                <option>Vehicles</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Value</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="$0.00" />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
