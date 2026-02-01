"use client";

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { 
  DataTable,
  FormModal,
  LoadingSpinner,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
  SkeletonTable,
  ContentLoader,
  AssetStatusBadge,
  StatusBadge,
  AssetQRCode,
  QRCodeDisplay,
  EmptySearch,
  EmptyAssets,
  ErrorState,
  useSuccessToast,
  useErrorToast,
  PageTransition,
  ResponsiveTable,
} from "../../components";
import { 
  Plus, 
  Search, 
  Download, 
  QrCode,
  Filter,
  RefreshCw,
  FileText,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

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

const conditionColors: Record<string, { variant: "success" | "info" | "warning" | "error" | "default"; label: string }> = {
  EXCELLENT: { variant: "success", label: "Excellent" },
  GOOD: { variant: "info", label: "Good" },
  FAIR: { variant: "warning", label: "Fair" },
  POOR: { variant: "error", label: "Poor" },
  CRITICAL: { variant: "error", label: "Critical" },
};

export default function AssetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();

  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set("search", searchQuery);
  if (filterStatus) queryParams.set("status", filterStatus);
  queryParams.set("page", page.toString());
  queryParams.set("limit", "20");

  const { data: response, loading, error, refetch } = useApi<AssetsResponse>(
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

  const handleExport = () => {
    showSuccess("Assets exported successfully!");
  };

  const handleRefresh = () => {
    refetch();
    showSuccess("Data refreshed!");
  };

  const handleCreateAsset = () => {
    showSuccess("Asset created successfully!");
    setIsModalOpen(false);
  };

  const columns = [
    { key: "assetNumber", header: "Asset ID" },
    { 
      key: "name", 
      header: "Name",
      render: (item: Asset) => (
        <Link href={`/ems/assets/${item.id}`} className="font-medium text-blue-600 hover:text-blue-800">
          {item.name}
        </Link>
      ),
    },
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
      render: (item: Asset) => <AssetStatusBadge status={item.status} />,
    },
    {
      key: "condition",
      header: "Condition",
      render: (item: Asset) => {
        const config = conditionColors[item.condition] || { variant: "default", label: item.condition };
        return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
      },
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
    {
      key: "qr",
      header: "",
      render: (item: Asset) => (
        <QRCodeDisplay 
          value={`${typeof window !== "undefined" ? window.location.origin : ""}/ems/assets/${item.id}`}
          title={item.name}
          description={item.assetNumber}
          size={128}
        />
      ),
    },
  ];

  if (error) {
    return (
      <ErrorState 
        title="Failed to load assets"
        description="We couldn't retrieve the asset data. Please try again."
        onRetry={refetch}
        error={new Error(error)}
      />
    );
  }

  return (
    <PageTransition>
      <FadeIn>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assets</h1>
            <p className="text-slate-500">Manage your equipment and assets</p>
          </div>
          <StaggerContainer className="flex flex-wrap gap-2" staggerDelay={0.05}>
            <StaggerItem>
              <ScaleOnHover>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </ScaleOnHover>
            </StaggerItem>
            <StaggerItem>
              <ScaleOnHover>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </ScaleOnHover>
            </StaggerItem>
            <StaggerItem>
              <ScaleOnHover>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Asset
                </button>
              </ScaleOnHover>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 pl-10 pr-8 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="REPAIR">Repair</option>
                <option value="RETIRED">Retired</option>
              </select>
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </FadeIn>

        {/* Table */}
        <ContentLoader 
          isLoading={loading}
          skeleton={<SkeletonTable rows={5} columns={9} />}
        >
          {assets.length === 0 && searchQuery ? (
            <EmptySearch query={searchQuery} onClear={() => setSearchQuery("")} />
          ) : assets.length === 0 ? (
            <EmptyAssets onCreate={() => setIsModalOpen(true)} />
          ) : (
            <>
              <ResponsiveTable>
                <DataTable
                  columns={columns}
                  data={assets}
                  onRowClick={(item) => window.location.href = `/ems/assets/${item.id}`}
                />
              </ResponsiveTable>
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <FadeIn delay={0.2}>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                      Showing {(pagination.page - 1) * pagination.limit + 1} - {" "}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                      {pagination.total} assets
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </FadeIn>
              )}
            </>
          )}
        </ContentLoader>

        {/* Add Asset Modal */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Asset"
          onSubmit={handleCreateAsset}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name *</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Enter asset name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select category</option>
                  <option value="IT">IT Equipment</option>
                  <option value="MACHINERY">Machinery</option>
                  <option value="FURNITURE">Furniture</option>
                  <option value="VEHICLES">Vehicles</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date *</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Value (RM) *</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                rows={3}
                placeholder="Enter asset description"
              />
            </div>
          </div>
        </FormModal>
      </FadeIn>
    </PageTransition>
  );
}
