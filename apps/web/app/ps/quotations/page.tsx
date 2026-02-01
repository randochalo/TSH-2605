"use client";

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../../components/DataTable";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface Quotation {
  id: string;
  quotationNumber: string;
  vendorName: string;
  vendor: { companyName: string };
  pr: { prNumber: string; title: string };
  quotationDate: string;
  validUntil: string;
  totalAmount: number;
  status: string;
  leadTimeDays: number;
  isSelected: boolean;
}

interface QuotationsResponse {
  data: Quotation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  RECEIVED: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  SHORTLISTED: "bg-cyan-100 text-cyan-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-orange-100 text-orange-800",
};

export default function QuotationsPage() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = new URLSearchParams();
  if (filterStatus) queryParams.set("status", filterStatus);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data: response, loading, error } = useApi<QuotationsResponse>(
    `/api/quotations?${queryParams.toString()}`
  );

  const quotations = response?.data || [];
  const pagination = response?.pagination;

  const filteredData = quotations.filter(
    (item) =>
      item.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
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
    { key: "quotationNumber", header: "Quotation ID" },
    {
      key: "pr",
      header: "PR Reference",
      render: (item: Quotation) => item.pr?.prNumber || "-",
    },
    {
      key: "vendor",
      header: "Vendor",
      render: (item: Quotation) => item.vendor?.companyName || item.vendorName || "-",
    },
    {
      key: "quotationDate",
      header: "Date",
      render: (item: Quotation) => formatDate(item.quotationDate),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      render: (item: Quotation) => formatDate(item.validUntil),
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (item: Quotation) => formatCurrency(item.totalAmount),
    },
    {
      key: "leadTimeDays",
      header: "Lead Time",
      render: (item: Quotation) => `${item.leadTimeDays} days`,
    },
    {
      key: "status",
      header: "Status",
      render: (item: Quotation) => (
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
          <h1 className="text-2xl font-bold">Quotation Management</h1>
          <p className="text-gray-500">Compare and evaluate vendor quotations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + New RFQ
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search quotations..."
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
          <option value="RECEIVED">Received</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading quotations: {error}
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
                {pagination.total} quotations
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
