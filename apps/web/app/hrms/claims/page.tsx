"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DataTable } from "../../../components/DataTable";
import { FormModal } from "../../../components/FormModal";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface Claim {
  id: string;
  claimNumber: string;
  claimType: string;
  employee: {
    fullName: string;
    employeeNumber: string;
  };
  claimDate: string;
  totalAmount: number;
  receiptCount: number;
  status: string;
  submittedAt: string;
}

interface Stats {
  pendingCount: number;
  approvedThisMonth: number;
  pendingAmount: number;
  totalCount: number;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PROCESSING_PAYMENT: "bg-purple-100 text-purple-800",
  PAID: "bg-green-100 text-green-800",
};

const claimTypeLabels: Record<string, string> = {
  MEDICAL: "Medical",
  TRAVEL: "Travel",
  MEAL: "Meal",
  TRANSPORT: "Transport",
  PHONE: "Phone",
  ENTERTAINMENT: "Entertainment",
  TRAINING: "Training",
  OTHER: "Other",
};

export default function ClaimsPage() {
  const { fetchWithAuth } = useApi();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string }>>([]);

  useEffect(() => {
    loadClaims();
    loadStats();
    loadEmployees();
  }, []);

  const loadClaims = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/api/claims?limit=50");
      if (response.ok) {
        const data = await response.json();
        setClaims(data.data);
      }
    } catch (error) {
      console.error("Error loading claims:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/api/claims/stats/overview");
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
      const response = await fetchWithAuth("/api/claims", {
        method: "POST",
        body: JSON.stringify({
          employeeId: data.employeeId,
          claimType: data.claimType,
          claimDate: data.claimDate,
          description: data.description,
          totalAmount: parseFloat(data.totalAmount as string),
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        loadClaims();
        loadStats();
      }
    } catch (error) {
      console.error("Error creating claim:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const columns = [
    { key: "claimNumber", header: "Claim ID" },
    {
      key: "employee",
      header: "Employee",
      render: (item: Claim) => (
        <div>
          <p className="font-medium">{item.employee?.fullName || "-"}</p>
          <p className="text-xs text-gray-500">{item.employee?.employeeNumber || "-"}</p>
        </div>
      ),
    },
    {
      key: "claimType",
      header: "Type",
      render: (item: Claim) => claimTypeLabels[item.claimType] || item.claimType,
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (item: Claim) => formatCurrency(item.totalAmount),
    },
    {
      key: "claimDate",
      header: "Date",
      render: (item: Claim) => new Date(item.claimDate).toLocaleDateString(),
    },
    {
      key: "receiptCount",
      header: "Receipts",
      render: (item: Claim) => (
        <span className="text-sm">
          {item.receiptCount > 0 ? `📎 ${item.receiptCount}` : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Claim) => (
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
          <h1 className="text-2xl font-bold">Claims & Reimbursement</h1>
          <p className="text-gray-500">Submit and approve expense claims</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Claim
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending Claims</p>
          <p className="text-2xl font-bold">{stats?.pendingCount || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Approved (This Month)</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.approvedThisMonth || 0)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.pendingAmount || 0)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Claims</p>
          <p className="text-2xl font-bold">{stats?.totalCount || 0}</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search claims..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable columns={columns} data={claims} />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Expense Claim"
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
            <label className="block text-sm font-medium mb-1">Claim Type</label>
            <select name="claimType" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="TRAVEL">Travel</option>
              <option value="MEAL">Meal</option>
              <option value="TRANSPORT">Transportation</option>
              <option value="MEDICAL">Medical</option>
              <option value="TRAINING">Training</option>
              <option value="PHONE">Phone</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (RM)</label>
            <input name="totalAmount" type="number" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input name="claimDate" type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
