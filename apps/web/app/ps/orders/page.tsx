import { DataTable } from "../../components/DataTable";

const ordersData = [
  { id: "PO-2024-0189", vendor: "Dell Technologies", description: "Server Equipment", amount: "$45,200", orderDate: "2024-01-10", deliveryDate: "2024-02-05", status: "In Transit" },
  { id: "PO-2024-0188", vendor: "ABC Office Supplies", description: "Stationery Q1", amount: "$3,450", orderDate: "2024-01-08", deliveryDate: "2024-01-20", status: "Delivered" },
  { id: "PO-2024-0187", vendor: "Industrial Metals Inc", description: "Steel Sheets", amount: "$45,000", orderDate: "2024-01-05", deliveryDate: "2024-01-25", status: "Partially Delivered" },
  { id: "PO-2024-0186", vendor: "TechFix Services", description: "Annual Support Contract", amount: "$24,000", orderDate: "2024-01-03", deliveryDate: "2024-12-31", status: "Active" },
  { id: "PO-2024-0185", vendor: "Global Logistics", description: "Transport Services", amount: "$8,500", orderDate: "2023-12-28", deliveryDate: "2024-01-15", status: "Delivered" },
];

const statusColors: Record<string, string> = {
  "In Transit": "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  "Partially Delivered": "bg-yellow-100 text-yellow-800",
  Active: "bg-purple-100 text-purple-800",
};

export default function OrdersPage() {
  const columns = [
    { key: "id", header: "PO Number" },
    { key: "vendor", header: "Vendor" },
    { key: "description", header: "Description" },
    { key: "amount", header: "Amount" },
    { key: "orderDate", header: "Order Date" },
    { key: "deliveryDate", header: "Delivery Date" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof ordersData[0]) => (
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
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-gray-500">Track and manage purchase orders</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Create PO
          </button>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search purchase orders..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={ordersData} />
    </div>
  );
}
