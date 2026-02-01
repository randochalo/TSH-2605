"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DataTable } from "../../../components/DataTable";
import { FormModal } from "../../../components/FormModal";

interface LeaveRequest {
  id: string;
  leaveType: string;
  employee: {
    fullName: string;
  };
  startDate: string;
  endDate: string;
  numberOfDays: number;
  status: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export default function LeavePage() {
  const { fetchWithAuth } = useApi();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/api/leave?limit=50");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error loading leave requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/api/leave/stats/overview");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchWithAuth("/api/leave", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          employeeId: "temp-employee-id", // Would come from auth context
          numberOfDays: 1, // Calculate from dates
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        loadRequests();
        loadStats();
      }
    } catch (error) {
      console.error("Error creating leave request:", error);
    }
  };

  const columns = [
    { key: "id", header: "Leave ID" },
    { 
      key: "employee", 
      header: "Employee",
      render: (item: LeaveRequest) => item.employee?.fullName || "-",
    },
    { key: "leaveType", header: "Leave Type" },
    { 
      key: "startDate", 
      header: "From",
      render: (item: LeaveRequest) => new Date(item.startDate).toLocaleDateString(),
    },
    { 
      key: "endDate", 
      header: "To",
      render: (item: LeaveRequest) => new Date(item.endDate).toLocaleDateString(),
    },
    { key: "numberOfDays", header: "Days" },
    {
      key: "status",
      header: "Status",
      render: (item: LeaveRequest) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status}
        </span>
      ),
    },
  ];

  const pendingCount = stats?.requestsByStatus?.find((s: any) => s.status === "PENDING")?._count?.status || 0;
  const approvedCount = stats?.requestsByStatus?.find((s: any) => s.status === "APPROVED")?._count?.status || 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-gray-500">Manage leave requests and balances</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Apply Leave
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending Requests</p>
          <p className="text-2xl font-bold">{stats?.pendingRequests || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Approved (This Month)</p>
          <p className="text-2xl font-bold">{approvedCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Currently On Leave</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-bold">{stats?.totalRequests || 0}</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search leave requests..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={requests} />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <select name="leaveType" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="ANNUAL">Annual Leave</option>
              <option value="MEDICAL">Sick Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
              <option value="MATERNITY">Maternity Leave</option>
              <option value="PATERNITY">Paternity Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input name="startDate" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input name="endDate" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea name="reason" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
