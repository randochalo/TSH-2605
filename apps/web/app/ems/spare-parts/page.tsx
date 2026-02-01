import { DataTable } from "../../../components/DataTable";

const sparePartsData = [
  { id: "SP-001", name: "Motor Belt - 12in", category: "Belts", quantity: 15, minLevel: 5, location: "Warehouse A", status: "In Stock" },
  { id: "SP-002", name: "Hydraulic Filter HF-100", category: "Filters", quantity: 3, minLevel: 5, location: "Warehouse B", status: "Low Stock" },
  { id: "SP-003", name: "Bearing 6204-2RS", category: "Bearings", quantity: 45, minLevel: 10, location: "Warehouse A", status: "In Stock" },
  { id: "SP-004", name: "Control Board CB-X200", category: "Electronics", quantity: 0, minLevel: 2, location: "Data Center", status: "Out of Stock" },
  { id: "SP-005", name: "Air Filter AF-500", category: "Filters", quantity: 8, minLevel: 10, location: "Warehouse A", status: "Low Stock" },
  { id: "SP-006", name: "Oil Seal 35x50x7", category: "Seals", quantity: 22, minLevel: 5, location: "Warehouse B", status: "In Stock" },
];

const statusColors: Record<string, string> = {
  "In Stock": "bg-green-100 text-green-800",
  "Low Stock": "bg-yellow-100 text-yellow-800",
  "Out of Stock": "bg-red-100 text-red-800",
};

export default function SparePartsPage() {
  const columns = [
    { key: "id", header: "Part ID" },
    { key: "name", header: "Part Name" },
    { key: "category", header: "Category" },
    { key: "quantity", header: "Quantity" },
    { key: "minLevel", header: "Min. Level" },
    { key: "location", header: "Location" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof sparePartsData[0]) => (
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
          <h1 className="text-2xl font-bold">Spare Parts Inventory</h1>
          <p className="text-gray-500">Manage spare parts and consumables</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Part
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total SKUs</p>
          <p className="text-2xl font-bold">324</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold">18</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold">6</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Inventory Value</p>
          <p className="text-2xl font-bold">$125,430</p>
        </div>
      </div>

      <DataTable columns={columns} data={sparePartsData} />
    </div>
  );
}
