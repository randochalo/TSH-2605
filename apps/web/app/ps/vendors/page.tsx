"use client";

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface Vendor {
  id: string;
  vendorCode: string;
  companyName: string;
  category: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  evaluationScore: number;
  paymentTerms: string;
  creditLimit: number;
  _count: {
    purchaseOrders: number;
    evaluations: number;
  };
}

interface VendorsResponse {
  data: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  SUSPENDED: "bg-orange-100 text-orange-800",
  BLACKLISTED: "bg-red-100 text-red-800",
  INACTIVE: "bg-gray-100 text-gray-800",
};

export default function VendorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (filterStatus) queryParams.set("status", filterStatus);
  if (searchQuery) queryParams.set("search", searchQuery);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data: response, loading, error } = useApi<VendorsResponse>(
    `/api/vendors?${queryParams.toString()}`
  );

  const vendors = response?.data || [];
  const pagination = response?.pagination;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const columns = [
    { key: "vendorCode", header: "Vendor ID" },
    { key: "companyName", header: "Company Name" },
    { key: "category", header: "Category" },
    { key: "contactEmail", header: "Email" },
    { key: "contactPhone", header: "Phone" },
    {
      key: "evaluationScore",
      header: "Rating",
      render: (item: Vendor) => (
        <span className="text-yellow-600">
          {"★".repeat(Math.floor(item.evaluationScore || 0))} {item.evaluationScore?.toFixed(1) || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Vendor) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100"}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "_count",
      header: "POs",
      render: (item: Vendor) => item._count?.purchaseOrders || 0,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <p className="text-gray-500">Manage approved vendors and suppliers</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Vendor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search vendors..."
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
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading vendors: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={vendors} />
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} - {" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} vendors
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

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Vendor"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Vehicles</option>
                <option>Equipment</option>
                <option>Fuel</option>
                <option>Parts</option>
                <option>Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax ID</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
