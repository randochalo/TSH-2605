"use client";

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface PurchaseRequisition {
  id: string;
  prNumber: string;
  title: string;
  description: string;
  requestorName: string;
  department: string;
  status: string;
  priority: string;
  totalAmount: number;
  submittedAt: string;
  lines: { itemDescription: string; quantity: number; estimatedTotal: number }[];
}

interface PRsResponse {
  data: PurchaseRequisition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  FULLY_ORDERED: "bg-blue-100 text-blue-800",
  PARTIALLY_ORDERED: "bg-purple-100 text-purple-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function RequisitionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (filterStatus) queryParams.set("status", filterStatus);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data: response, loading, error } = useApi<PRsResponse>(
    `/api/requisitions?${queryParams.toString()}`
  );

  const prs = response?.data || [];
  const pagination = response?.pagination;

  const filteredData = prs.filter(
    (item) =>
      item.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString("en-MY") : "-";
  };

  const columns = [
    { key: "prNumber", header: "PR Number" },
    { key: "title", header: "Title" },
    { key: "requestorName", header: "Requestor" },
    { key: "department", header: "Department" },
    {
      key: "priority",
      header: "Priority",
      render: (item: PurchaseRequisition) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[item.priority] || "bg-gray-100"}`}>
          {item.priority}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (item: PurchaseRequisition) => formatCurrency(item.totalAmount),
    },
    {
      key: "submittedAt",
      header: "Date",
      render: (item: PurchaseRequisition) => formatDate(item.submittedAt),
    },
    {
      key: "status",
      header: "Status",
      render: (item: PurchaseRequisition) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100"}`}>
          {item.status.replace(/_/g, " ")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Requisitions</h1>
          <p className="text-gray-500">Create and manage purchase requisitions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Requisition
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search requisitions..."
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
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="FULLY_ORDERED">Fully Ordered</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading requisitions: {error}
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
                {pagination.total} requisitions
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
        title="New Purchase Requisition"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Operations</option>
                <option>Maintenance</option>
                <option>IT</option>
                <option>Admin</option>
                <option>HR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>URGENT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Amount</label>
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.00" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
