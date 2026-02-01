import { DataTable } from "../../../components/DataTable";

const warrantyData = [
  { id: "AST-001", asset: "Dell Laptop XPS 15", vendor: "Dell Technologies", startDate: "2023-01-15", expiryDate: "2026-01-15", daysLeft: 730, status: "Active" },
  { id: "AST-005", asset: "Server Dell R740", vendor: "Dell Technologies", startDate: "2022-11-30", expiryDate: "2025-11-30", daysLeft: 679, status: "Active" },
  { id: "AST-010", asset: "HVAC Unit #3", vendor: "Carrier Corp", startDate: "2023-06-01", expiryDate: "2025-06-01", daysLeft: 498, status: "Active" },
  { id: "AST-015", asset: "CNC Machine M2", vendor: "Haas Automation", startDate: "2021-03-15", expiryDate: "2024-03-15", daysLeft: 55, status: "Expiring Soon" },
  { id: "AST-020", asset: "Generator #1", vendor: "Cummins", startDate: "2020-08-10", expiryDate: "2023-08-10", daysLeft: -162, status: "Expired" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  "Expiring Soon": "bg-yellow-100 text-yellow-800",
  Expired: "bg-red-100 text-red-800",
};

export default function WarrantyPage() {
  const columns = [
    { key: "id", header: "Asset ID" },
    { key: "asset", header: "Asset" },
    { key: "vendor", header: "Vendor" },
    { key: "startDate", header: "Start Date" },
    { key: "expiryDate", header: "Expiry Date" },
    {
      key: "daysLeft",
      header: "Days Left",
      render: (item: typeof warrantyData[0]) => (
        <span className={item.daysLeft < 0 ? "text-red-600 font-medium" : item.daysLeft < 90 ? "text-yellow-600 font-medium" : ""}>
          {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days ago` : `${item.daysLeft} days`}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: typeof warrantyData[0]) => (
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
          <h1 className="text-2xl font-bold">Warranty Tracking</h1>
          <p className="text-gray-500">Monitor asset warranties and coverage</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Warranty
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Active Warranties</p>
          <p className="text-2xl font-bold">1,142</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Expiring Soon (30d)</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Claims Filed (YTD)</p>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>

      <DataTable columns={columns} data={warrantyData} />
    </div>
  );
}
