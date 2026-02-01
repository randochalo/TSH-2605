"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const vendorsData = [
  { id: "V-001", name: "Dell Technologies", category: "IT Equipment", contact: "sales@dell.com", phone: "+1-800-DELL", status: "Approved", rating: 4.8 },
  { id: "V-002", name: "ABC Office Supplies", category: "Office Supplies", contact: "orders@abc.com", phone: "+1-555-0123", status: "Approved", rating: 4.2 },
  { id: "V-003", name: "Industrial Metals Inc", category: "Raw Materials", contact: "sales@indmet.com", phone: "+1-555-0456", status: "Approved", rating: 4.5 },
  { id: "V-004", name: "TechFix Services", category: "Services", contact: "support@techfix.com", phone: "+1-555-0789", status: "Pending", rating: 4.0 },
  { id: "V-005", name: "Global Logistics", category: "Logistics", contact: "info@globallog.com", phone: "+1-555-0321", status: "Approved", rating: 4.6 },
  { id: "V-006", name: "Safety First Corp", category: "Safety Equipment", contact: "sales@safetyfirst.com", phone: "+1-555-0654", status: "On Hold", rating: 3.8 },
];

const statusColors: Record<string, string> = {
  Approved: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  "On Hold": "bg-red-100 text-red-800",
};

export default function VendorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = vendorsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "id", header: "Vendor ID" },
    { key: "name", header: "Company Name" },
    { key: "category", header: "Category" },
    { key: "contact", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "rating",
      header: "Rating",
      render: (item: typeof vendorsData[0]) => (
        <span className="text-yellow-600">{"★".repeat(Math.floor(item.rating))} {item.rating}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: typeof vendorsData[0]) => (
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
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <p className="text-gray-500">Manage approved vendors and suppliers</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Vendor
          </button>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search vendors..."
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
        title="Add New Vendor"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>IT Equipment</option>
                <option>Office Supplies</option>
                <option>Raw Materials</option>
                <option>Services</option>
                <option>Logistics</option>
                <option>Safety Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax ID</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
