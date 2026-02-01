"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const leaveData = [
  { id: "LV-2024-0123", employee: "John Smith", type: "Annual Leave", from: "2024-01-25", to: "2024-01-28", days: 3, status: "Pending" },
  { id: "LV-2024-0122", employee: "Lisa Wang", type: "Sick Leave", from: "2024-02-01", to: "2024-02-02", days: 2, status: "Approved" },
  { id: "LV-2024-0121", employee: "Mike Johnson", type: "Personal Leave", from: "2024-01-20", to: "2024-01-20", days: 1, status: "Approved" },
  { id: "LV-2024-0120", employee: "Sarah Chen", type: "Annual Leave", from: "2024-02-14", to: "2024-02-16", days: 3, status: "Pending" },
  { id: "LV-2024-0119", employee: "David Lee", type: "Sick Leave", from: "2024-01-15", to: "2024-01-16", days: 2, status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function LeavePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "id", header: "Leave ID" },
    { key: "employee", header: "Employee" },
    { key: "type", header: "Leave Type" },
    { key: "from", header: "From" },
    { key: "to", header: "To" },
    { key: "days", header: "Days" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof leaveData[0]) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ];

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
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Approved (This Month)</p>
          <p className="text-2xl font-bold">28</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Currently On Leave</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg Leave Balance</p>
          <p className="text-2xl font-bold">18 days</p>
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

      <DataTable columns={columns} data={leaveData} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Personal Leave</option>
              <option>Maternity/Paternity Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
