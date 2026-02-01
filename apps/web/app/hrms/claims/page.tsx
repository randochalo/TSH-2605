"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const claimsData = [
  { id: "CL-2024-0089", employee: "John Smith", type: "Travel", amount: "$450", date: "2024-01-18", status: "Pending" },
  { id: "CL-2024-0088", employee: "Sarah Chen", type: "Meal", amount: "$85", date: "2024-01-17", status: "Approved" },
  { id: "CL-2024-0087", employee: "Mike Johnson", type: "Transportation", amount: "$120", date: "2024-01-16", status: "Approved" },
  { id: "CL-2024-0086", employee: "David Lee", type: "Medical", amount: "$1,250", date: "2024-01-15", status: "Pending" },
  { id: "CL-2024-0085", employee: "Lisa Wang", type: "Training", amount: "$650", date: "2024-01-14", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ClaimsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "id", header: "Claim ID" },
    { key: "employee", header: "Employee" },
    { key: "type", header: "Type" },
    { key: "amount", header: "Amount" },
    { key: "date", header: "Submitted" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof claimsData[0]) => (
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
          <p className="text-2xl font-bold">18</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Approved (This Month)</p>
          <p className="text-2xl font-bold">$12,450</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending Amount</p>
          <p className="text-2xl font-bold">$3,280</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg. Processing Time</p>
          <p className="text-2xl font-bold">2.5 days</p>
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

      <DataTable columns={columns} data={claimsData} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Expense Claim"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Claim Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Travel</option>
              <option>Meal</option>
              <option>Transportation</option>
              <option>Medical</option>
              <option>Training</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="$0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Receipt</label>
            <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
