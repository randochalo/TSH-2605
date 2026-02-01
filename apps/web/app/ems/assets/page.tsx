"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const sampleAssets = [
  { id: "AST-001", name: "Dell Laptop XPS 15", category: "IT Equipment", location: "HQ - Floor 3", status: "Active", purchaseDate: "2023-01-15", value: "$1,899" },
  { id: "AST-002", name: "CNC Machine M1", category: "Machinery", location: "Factory A", status: "Active", purchaseDate: "2022-06-20", value: "$45,000" },
  { id: "AST-003", name: "Herman Miller Chair", category: "Furniture", location: "HQ - Floor 2", status: "Active", purchaseDate: "2023-03-10", value: "$1,200" },
  { id: "AST-004", name: "Toyota Forklift FL-12", category: "Vehicles", location: "Warehouse B", status: "Maintenance", purchaseDate: "2021-09-05", value: "$28,500" },
  { id: "AST-005", name: "Server Dell R740", category: "IT Equipment", location: "Data Center", status: "Active", purchaseDate: "2022-11-30", value: "$8,500" },
  { id: "AST-006", name: "Air Compressor AC-100", category: "Machinery", location: "Factory B", status: "Repair", purchaseDate: "2021-04-12", value: "$5,200" },
  { id: "AST-007", name: "MacBook Pro 16\"", category: "IT Equipment", location: "HQ - Floor 4", status: "Active", purchaseDate: "2023-08-01", value: "$2,499" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Maintenance: "bg-yellow-100 text-yellow-800",
  Repair: "bg-red-100 text-red-800",
  Retired: "bg-gray-100 text-gray-800",
};

export default function AssetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredAssets = sampleAssets.filter(
    (asset) =>
      (asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === "" || asset.status === filterStatus)
  );

  const columns = [
    { key: "id", header: "Asset ID" },
    { key: "name", header: "Name" },
    { key: "category", header: "Category" },
    { key: "location", header: "Location" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof sampleAssets[0]) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    { key: "purchaseDate", header: "Purchase Date" },
    { key: "value", header: "Value" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assets</h1>
          <p className="text-gray-500">Manage your equipment and assets</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Repair">Repair</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        onRowClick={(item) => window.location.href = `/ems/assets/${item.id}`}
      />

      {/* Add Asset Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Asset"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>IT Equipment</option>
                <option>Machinery</option>
                <option>Furniture</option>
                <option>Vehicles</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Value</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="$0.00" />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
