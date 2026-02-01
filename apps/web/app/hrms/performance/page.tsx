"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DataTable } from "../../../components/DataTable";
import { FormModal } from "../../../components/FormModal";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface PerformanceReview {
  id: string;
  employee: {
    employeeNumber: string;
    fullName: string;
    department: string;
  };
  reviewPeriod: string;
  reviewType: string;
  overallRating: number;
  performanceScore: number;
  status: string;
  reviewedBy: string;
  reviewDate: string;
}

interface Stats {
  outstandingCount: number;
  exceedsCount: number;
  meetsCount: number;
  needsImprovementCount: number;
  totalReviews: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  SELF_REVIEW: "bg-blue-100 text-blue-800",
  MANAGER_REVIEW: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  ACKNOWLEDGED: "bg-gray-100 text-gray-800",
};

const ratingLabels: Record<number, string> = {
  5: "Outstanding",
  4: "Exceeds",
  3: "Meets",
  2: "Needs Improvement",
  1: "Unsatisfactory",
};

const ratingColors: Record<number, string> = {
  5: "bg-purple-100 text-purple-800",
  4: "bg-green-100 text-green-800",
  3: "bg-blue-100 text-blue-800",
  2: "bg-yellow-100 text-yellow-800",
  1: "bg-red-100 text-red-800",
};

export default function PerformancePage() {
  const { fetchWithAuth } = useApi();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string }>>([]);

  useEffect(() => {
    loadReviews();
    loadStats();
    loadEmployees();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/api/performance?limit=50");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/api/performance/stats/overview");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetchWithAuth("/api/employees?status=ACTIVE&limit=100");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data.map((e: any) => ({ id: e.id, fullName: e.fullName })));
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchWithAuth("/api/performance", {
        method: "POST",
        body: JSON.stringify({
          employeeId: data.employeeId,
          reviewPeriod: data.reviewPeriod,
          reviewType: data.reviewType,
          overallRating: parseFloat(data.overallRating as string),
          performanceScore: parseFloat(data.performanceScore as string),
          reviewedBy: data.reviewedBy,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        loadReviews();
        loadStats();
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const columns = [
    { key: "employeeNumber", header: "Employee ID", render: (item: PerformanceReview) => item.employee?.employeeNumber },
    {
      key: "name",
      header: "Name",
      render: (item: PerformanceReview) => (
        <div>
          <p className="font-medium">{item.employee?.fullName}</p>
          <p className="text-xs text-gray-500">{item.employee?.department}</p>
        </div>
      ),
    },
    { key: "reviewPeriod", header: "Period" },
    {
      key: "overallRating",
      header: "Rating",
      render: (item: PerformanceReview) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ratingColors[Math.round(item.overallRating)] || "bg-gray-100"}`}>
          {ratingLabels[Math.round(item.overallRating)] || "N/A"}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (item: PerformanceReview) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${item.performanceScore >= 80 ? "bg-purple-600" : item.performanceScore >= 60 ? "bg-green-600" : "bg-yellow-600"}`}
              style={{ width: `${Math.min(item.performanceScore, 100)}%` }}
            />
          </div>
          <span className="text-sm">{item.performanceScore?.toFixed(0)}%</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: PerformanceReview) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status.replace(/_/g, " ")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance Appraisal</h1>
          <p className="text-gray-500">Manage performance reviews and evaluations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Outstanding</p>
          <p className="text-2xl font-bold">{stats?.outstandingCount || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Exceeds</p>
          <p className="text-2xl font-bold">{stats?.exceedsCount || 0}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Meets</p>
          <p className="text-2xl font-bold">{stats?.meetsCount || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Needs Improvement</p>
          <p className="text-2xl font-bold">{stats?.needsImprovementCount || 0}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-2xl font-bold">{stats?.totalReviews || 0}</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search performance reviews..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable columns={columns} data={reviews} />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Performance Review"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select name="employeeId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Review Period</label>
            <input name="reviewPeriod" type="month" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Review Type</label>
            <select name="reviewType" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="ANNUAL">Annual Review</option>
              <option value="MID_YEAR">Mid-Year Review</option>
              <option value="PROBATION">Probation Review</option>
              <option value="PROMOTION">Promotion Review</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Overall Rating (1-5)</label>
            <select name="overallRating" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="5">5 - Outstanding</option>
              <option value="4">4 - Exceeds Expectations</option>
              <option value="3">3 - Meets Expectations</option>
              <option value="2">2 - Needs Improvement</option>
              <option value="1">1 - Unsatisfactory</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Performance Score (0-100)</label>
            <input name="performanceScore" type="number" min="0" max="100" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reviewed By</label>
            <input name="reviewedBy" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Manager name" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
