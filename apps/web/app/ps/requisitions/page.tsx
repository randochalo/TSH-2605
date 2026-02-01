"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const requisitionsData = [
  { id: "PR-2024-0156", requestor: "John Smith", department: "IT", description: "Dell Laptops x10", amount: "$12,500", date: "2024-01-18", status: "Pending Approval" },
  { id: "PR-2024-0155", requestor: "Sarah Chen", department: "HR", description: "Office Furniture", amount: "$8,200", date: "2024-01-18", status: "Pending Approval" },
  { id: "PR-2024-0154", requestor: "Mike Johnson", department: "Production", description: "Raw Materials Batch #45", amount: "$25,000", date: "2024-01-17", status: "Approved" },
  { id: "PR-2024-0153", requestor: "Lisa Wang", department: "Marketing", description: "Event Supplies", amount: "$3,450", date: "2024-01-17", status: "Rejected" },
  { id: "PR-2024-0152", requestor: "David Lee", department: "IT", description: "Server Upgrades", amount: "$18,900", date: "2024-01-16", status: "Approved" },
  { id: "PR-2024-0151", requestor: "Emma Wilson", department: "Operations", description: "Safety Equipment", amount: "$5,600", date: "2024-01-15", status: "PO Created" },
];

const statusColors: Record<string, string> = {
  "Pending Approval": "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  "PO Created": "bg-blue-100 text-blue-800",
};

export default function RequisitionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = requisitionsData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "id", header: "PR Number" },
    { key: "requestor", header: "Requestor" },
    { key: "department", header: "Department" },
    { key: "description", header: "Description" },
    { key: "amount", header: "Amount" },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof requisitionsData[0]) => (
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

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search requisitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={filteredData} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Purchase Requisition"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Justification</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>IT</option>
                <option>HR</option>
                <option>Production</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Amount</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="$0.00" />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
