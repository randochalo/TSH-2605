"use client";

import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface ReportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  reports: Report[];
}

interface Report {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  params?: string[];
}

const reportCategories: ReportCategory[] = [
  {
    id: "ems",
    name: "Equipment Management",
    description: "Asset, maintenance, and repair reports",
    icon: "🔧",
    reports: [
      {
        id: "asset-register",
        name: "Asset Register",
        description: "Complete list of all assets with current values",
        endpoint: "/api/reports/ems/asset-register",
      },
      {
        id: "depreciation-schedule",
        name: "Depreciation Schedule",
        description: "Monthly depreciation by asset category",
        endpoint: "/api/reports/ems/depreciation",
        params: ["year", "month"],
      },
      {
        id: "maintenance-history",
        name: "Maintenance History",
        description: "All maintenance records with costs",
        endpoint: "/api/reports/ems/maintenance",
        params: ["startDate", "endDate"],
      },
      {
        id: "repair-analysis",
        name: "Repair Analysis",
        description: "Breakdown of repairs by asset type",
        endpoint: "/api/reports/ems/repairs",
        params: ["startDate", "endDate"],
      },
      {
        id: "warranty-expiry",
        name: "Warranty Expiry Report",
        description: "Upcoming warranty expirations",
        endpoint: "/api/reports/ems/warranty-expiry",
        params: ["daysAhead"],
      },
    ],
  },
  {
    id: "ps",
    name: "Procurement",
    description: "Purchase orders, vendors, and budgets",
    icon: "📦",
    reports: [
      {
        id: "po-summary",
        name: "Purchase Order Summary",
        description: "All POs by status and department",
        endpoint: "/api/reports/ps/po-summary",
        params: ["startDate", "endDate"],
      },
      {
        id: "vendor-performance",
        name: "Vendor Performance",
        description: "Delivery times and quality ratings",
        endpoint: "/api/reports/ps/vendor-performance",
      },
      {
        id: "spend-analysis",
        name: "Spend Analysis",
        description: "Expenditure by category and department",
        endpoint: "/api/reports/ps/spend-analysis",
        params: ["fiscalYear"],
      },
      {
        id: "budget-vs-actual",
        name: "Budget vs Actual",
        description: "Comparison of budgeted vs spent amounts",
        endpoint: "/api/reports/ps/budget-vs-actual",
        params: ["fiscalYear"],
      },
      {
        id: "three-way-matching",
        name: "3-Way Matching Report",
        description: "Matching status for all transactions",
        endpoint: "/api/reports/ps/three-way-matching",
        params: ["startDate", "endDate"],
      },
    ],
  },
  {
    id: "hrms",
    name: "Human Resources",
    description: "Payroll, attendance, and employee data",
    icon: "👥",
    reports: [
      {
        id: "employee-directory",
        name: "Employee Directory",
        description: "Complete employee contact information",
        endpoint: "/api/reports/hrms/employee-directory",
      },
      {
        id: "payroll-summary",
        name: "Payroll Summary",
        description: "Monthly payroll by department",
        endpoint: "/api/reports/hrms/payroll-summary",
        params: ["year", "month"],
      },
      {
        id: "statutory-contributions",
        name: "Statutory Contributions",
        description: "EPF, SOCSO, EIS, PCB summary",
        endpoint: "/api/reports/hrms/statutory",
        params: ["year", "month"],
      },
      {
        id: "attendance-report",
        name: "Attendance Report",
        description: "Daily attendance by department",
        endpoint: "/api/reports/hrms/attendance",
        params: ["startDate", "endDate"],
      },
      {
        id: "leave-balance",
        name: "Leave Balance Report",
        description: "Employee leave balances",
        endpoint: "/api/reports/hrms/leave-balance",
        params: ["year"],
      },
      {
        id: "claims-summary",
        name: "Claims Summary",
        description: "Employee claims by type and status",
        endpoint: "/api/reports/hrms/claims",
        params: ["startDate", "endDate"],
      },
    ],
  },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportCSV = async (report: Report) => {
    setExporting(report.id);
    try {
      // In a real implementation, this would call the API with the report endpoint
      // For now, simulate the export
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate sample CSV content
      const csvContent = generateSampleCSV(report);
      downloadCSV(csvContent, `${report.id}.csv`);
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setExporting(null);
    }
  };

  const generateSampleCSV = (report: Report): string => {
    const headers = ["Column 1", "Column 2", "Column 3", "Column 4", "Column 5"];
    const rows = [
      ["Sample Data 1", "Sample Data 2", "1000", "2024-01-01", "Active"],
      ["Sample Data 3", "Sample Data 4", "2000", "2024-01-02", "Pending"],
      ["Sample Data 5", "Sample Data 6", "3000", "2024-01-03", "Completed"],
    ];
    
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCategories =
    selectedCategory === "all"
      ? reportCategories
      : reportCategories.filter((c) => c.id === selectedCategory);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports Center</h1>
        <p className="text-gray-500">
          Generate and export reports from all modules
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Reports
        </button>
        {reportCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{report.name}</h3>
                    {exporting === report.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <button
                        onClick={() => handleExportCSV(report)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Export to CSV"
                      >
                        <span>📥</span>
                        <span>CSV</span>
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                  
                  {/* Report Parameters */}
                  {report.params && report.params.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {report.params.map((param) => (
                        <span
                          key={param}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Links */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => window.open(report.endpoint, "_blank")}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View API →
                    </button>
                    <button
                      onClick={() => handleExportCSV(report)}
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      Download Sample
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Report Usage Tips */}
      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">📊 Reporting Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All reports can be exported to CSV format for Excel analysis</li>
          <li>• Use date range parameters to filter historical data</li>
          <li>• Fiscal year reports align with the company's financial calendar (Jan-Dec)</li>
          <li>• Contact IT support for custom report requests</li>
        </ul>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-blue-600">
            {reportCategories.reduce((acc, c) => acc + c.reports.length, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Reports</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-green-600">
            {reportCategories.length}
          </p>
          <p className="text-sm text-gray-600">Categories</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-purple-600">CSV</p>
          <p className="text-sm text-gray-600">Export Format</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-orange-600">Real-time</p>
          <p className="text-sm text-gray-600">Data Updates</p>
        </div>
      </div>
    </div>
  );
}
