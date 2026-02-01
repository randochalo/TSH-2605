"use client";

import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { DashboardCard } from "../../../components/DashboardCard";
import { DataTable } from "../../../components/DataTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  description: string;
  category: { name: string };
  location: { name: string };
  branch: { name: string };
  status: string;
  condition: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  serialNumber: string;
  manufacturer: string;
  model: string;
  yearOfManufacture: number;
  usefulLifeYears: number;
  depreciationMethod: string;
  maintenanceRecords: MaintenanceRecord[];
  repairOrders: RepairOrder[];
  warranties: Warranty[];
  depreciationEntries: DepreciationEntry[];
}

interface MaintenanceRecord {
  id: string;
  workOrderNumber: string;
  title: string;
  status: string;
  scheduledStartAt: string;
  actualStartAt: string;
  actualEndAt: string;
  totalCost: number;
}

interface RepairOrder {
  id: string;
  orderNumber: string;
  title: string;
  status: string;
  reportedAt: string;
  totalCost: number;
}

interface Warranty {
  id: string;
  warrantyNumber: string;
  provider: string;
  startDate: string;
  endDate: string;
  coverage: string;
}

interface DepreciationEntry {
  id: string;
  periodYear: number;
  periodMonth: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
}

function calculateDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  method: string,
  startDate: string
) {
  const start = new Date(startDate);
  const now = new Date();
  const monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  
  let schedule = [];
  let accumulatedDepreciation = 0;
  
  if (method === "STRAIGHT_LINE") {
    const monthlyDepreciation = (cost - salvageValue) / (usefulLife * 12);
    
    for (let i = 0; i < Math.min(monthsElapsed + 12, usefulLife * 12); i++) {
      const date = new Date(start);
      date.setMonth(date.getMonth() + i);
      accumulatedDepreciation += monthlyDepreciation;
      schedule.push({
        month: date.toLocaleDateString("en-MY", { month: "short", year: "numeric" }),
        depreciation: monthlyDepreciation,
        accumulated: Math.min(accumulatedDepreciation, cost - salvageValue),
        bookValue: Math.max(cost - accumulatedDepreciation, salvageValue),
      });
    }
  } else if (method === "DECLINING_BALANCE") {
    const rate = 2 / usefulLife; // Double declining balance
    let bookValue = cost;
    
    for (let i = 0; i < Math.min(monthsElapsed + 12, usefulLife * 12); i++) {
      const date = new Date(start);
      date.setMonth(date.getMonth() + i);
      const depreciation = bookValue * (rate / 12);
      accumulatedDepreciation += depreciation;
      bookValue = Math.max(bookValue - depreciation, salvageValue);
      schedule.push({
        month: date.toLocaleDateString("en-MY", { month: "short", year: "numeric" }),
        depreciation,
        accumulated: Math.min(accumulatedDepreciation, cost - salvageValue),
        bookValue,
      });
    }
  }
  
  return schedule;
}

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const { data: asset, loading, error } = useApi<Asset>(`/api/assets/${params.id}`);
  const [depreciationSchedule, setDepreciationSchedule] = useState<any[]>([]);

  useEffect(() => {
    if (asset) {
      const schedule = calculateDepreciation(
        asset.acquisitionCost,
        asset.acquisitionCost * 0.1, // 10% salvage value
        asset.usefulLifeYears,
        asset.depreciationMethod,
        asset.acquisitionDate
      );
      setDepreciationSchedule(schedule);
    }
  }, [asset]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-MY");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      MAINTENANCE: "bg-yellow-100 text-yellow-800",
      REPAIR: "bg-red-100 text-red-800",
      RETIRED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100";
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Error loading asset: {error || "Asset not found"}
      </div>
    );
  }

  const totalDepreciation = asset.acquisitionCost - asset.currentValue;
  const depreciationPercentage = (totalDepreciation / asset.acquisitionCost) * 100;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4">
        <a href="/ems/assets" className="text-blue-600 hover:text-blue-800">← Back to Assets</a>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{asset.name}</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </div>
          <p className="text-gray-500">{asset.assetNumber} • {asset.category?.name}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📝 Edit
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🔧 Schedule Maintenance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Purchase Value"
          value={formatCurrency(asset.acquisitionCost)}
          color="blue"
        />
        <DashboardCard
          title="Current Value"
          value={formatCurrency(asset.currentValue)}
          color="green"
        />
        <DashboardCard
          title="Total Depreciation"
          value={formatCurrency(totalDepreciation)}
          color="yellow"
        />
        <DashboardCard
          title="Accumulated"
          value={`${depreciationPercentage.toFixed(1)}%`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Asset Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Asset ID</p>
                <p className="font-medium">{asset.assetNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{asset.serialNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{asset.location?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium">{asset.branch?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Manufacturer</p>
              <p className="font-medium">{asset.manufacturer} {asset.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year of Manufacture</p>
              <p className="font-medium">{asset.yearOfManufacture}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Date</p>
              <p className="font-medium">{formatDate(asset.acquisitionDate)}</p>
            </div>
          </div>
        </div>

        {/* Depreciation Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Depreciation ({asset.depreciationMethod.replace("_", " ")})</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Purchase Value</span>
              <span className="font-medium">{formatCurrency(asset.acquisitionCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Value</span>
              <span className="font-medium">{formatCurrency(asset.currentValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Depreciation</span>
              <span className="font-medium text-red-600">-{formatCurrency(totalDepreciation)} ({depreciationPercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Depreciation Method</span>
              <span className="font-medium">{asset.depreciationMethod.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Useful Life</span>
              <span className="font-medium">{asset.usefulLifeYears} years</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(depreciationPercentage, 100)}%` }} 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {depreciationPercentage.toFixed(1)}% depreciated
            </p>
          </div>
          
          {/* Depreciation Schedule Preview */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-2">Recent Depreciation</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {depreciationSchedule.slice(0, 6).map((entry, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-gray-500">{entry.month}</span>
                  <span className="font-medium">{formatCurrency(entry.depreciation)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warranty Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Warranty Status</h2>
          {asset.warranties && asset.warranties.length > 0 ? (
            asset.warranties.map((warranty) => {
              const daysLeft = getDaysUntilExpiry(warranty.endDate);
              const isExpired = daysLeft < 0;
              const expiringSoon = daysLeft > 0 && daysLeft < 90;
              
              return (
                <div key={warranty.id} className="space-y-4">
                  <div className={`p-4 rounded-lg ${isExpired ? "bg-red-50" : expiringSoon ? "bg-yellow-50" : "bg-green-50"}`}>
                    <p className={`font-medium ${isExpired ? "text-red-800" : expiringSoon ? "text-yellow-800" : "text-green-800"}`}>
                      {isExpired ? "✗ Expired" : expiringSoon ? "⚠ Expiring Soon" : "✓ Under Warranty"}
                    </p>
                    <p className={`text-sm mt-1 ${isExpired ? "text-red-600" : expiringSoon ? "text-yellow-600" : "text-green-600"}`}>
                      {isExpired ? `${Math.abs(daysLeft)} days ago` : `${daysLeft} days remaining`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p className="font-medium">{warranty.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty Number</p>
                    <p className="font-medium">{warranty.warrantyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty Start</p>
                    <p className="font-medium">{formatDate(warranty.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty End</p>
                    <p className="font-medium">{formatDate(warranty.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Coverage</p>
                    <p className="font-medium">{warranty.coverage}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No warranty information available
            </div>
          )}
        </div>
      </div>

      {/* Maintenance History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Maintenance History</h2>
        {asset.maintenanceRecords && asset.maintenanceRecords.length > 0 ? (
          <DataTable
            columns={[
              { key: "workOrderNumber", header: "ID" },
              { key: "title", header: "Title" },
              { key: "status", header: "Status" },
              { key: "actualStartAt", header: "Date", render: (item) => item.actualStartAt ? formatDate(item.actualStartAt) : "-" },
              { key: "totalCost", header: "Cost", render: (item) => formatCurrency(item.totalCost) },
            ]}
            data={asset.maintenanceRecords}
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No maintenance records found
          </div>
        )}
      </div>

      {/* Repair History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Repair History</h2>
        {asset.repairOrders && asset.repairOrders.length > 0 ? (
          <DataTable
            columns={[
              { key: "orderNumber", header: "ID" },
              { key: "title", header: "Title" },
              { key: "status", header: "Status" },
              { key: "reportedAt", header: "Date", render: (item) => formatDate(item.reportedAt) },
              { key: "totalCost", header: "Cost", render: (item) => formatCurrency(item.totalCost) },
            ]}
            data={asset.repairOrders}
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No repair records found
          </div>
        )}
      </div>
    </div>
  );
}
