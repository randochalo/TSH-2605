import { DataTable } from "../../components/DataTable";

const receiptsData = [
  { id: "GR-2024-0234", poId: "PO-2024-0188", vendor: "ABC Office Supplies", description: "Stationery Q1", receivedQty: 500, expectedQty: 500, date: "2024-01-20", status: "Fully Received" },
  { id: "GR-2024-0233", poId: "PO-2024-0187", vendor: "Industrial Metals Inc", description: "Steel Sheets", receivedQty: 300, expectedQty: 500, date: "2024-01-18", status: "Partial" },
  { id: "GR-2024-0232", poId: "PO-2024-0185", vendor: "Global Logistics", description: "Transport Services", receivedQty: 1, expectedQty: 1, date: "2024-01-15", status: "Fully Received" },
  { id: "GR-2024-0231", poId: "PO-2024-0184", vendor: "Safety First Corp", description: "Safety Helmets x50", receivedQty: 50, expectedQty: 50, date: "2024-01-12", status: "Fully Received" },
  { id: "GR-2024-0230", poId: "PO-2024-0183", vendor: "Dell Technologies", description: "Monitors x20", receivedQty: 20, expectedQty: 20, date: "2024-01-10", status: "Fully Received" },
];

const statusColors: Record<string, string> = {
  "Fully Received": "bg-green-100 text-green-800",
  Partial: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ReceiptsPage() {
  const columns = [
    { key: "id", header: "GR Number" },
    { key: "poId", header: "PO Reference" },
    { key: "vendor", header: "Vendor" },
    { key: "description", header: "Description" },
    {
      key: "receivedQty",
      header: "Qty Received",
      render: (item: typeof receiptsData[0]) => (
        <span className={item.receivedQty < item.expectedQty ? "text-yellow-600 font-medium" : ""}>
          {item.receivedQty} / {item.expectedQty}
        </span>
      ),
    },
    { key: "date", header: "Received Date" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof receiptsData[0]) => (
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
          <h1 className="text-2xl font-bold">Goods Receipts</h1>
          <p className="text-gray-500">Record and verify incoming goods</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Record Receipt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Fully Received (This Month)</p>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Partial Receipts</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Rejected/Damaged</p>
          <p className="text-2xl font-bold">1</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search receipts..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={receiptsData} />
    </div>
  );
}
