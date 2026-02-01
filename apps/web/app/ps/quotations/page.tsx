import { DataTable } from "../../components/DataTable";

const quotationsData = [
  { id: "QT-2024-0045", rfqId: "RFQ-2024-012", vendor: "Dell Technologies", description: "Laptops Batch Q1", amount: "$12,500", validity: "2024-02-15", status: "Under Review" },
  { id: "QT-2024-0044", rfqId: "RFQ-2024-012", vendor: "HP Inc", description: "Laptops Batch Q1", amount: "$13,200", validity: "2024-02-10", status: "Under Review" },
  { id: "QT-2024-0043", rfqId: "RFQ-2024-012", vendor: "Lenovo", description: "Laptops Batch Q1", amount: "$11,800", validity: "2024-02-20", status: "Shortlisted" },
  { id: "QT-2024-0042", rfqId: "RFQ-2024-011", vendor: "Steel Corp", description: "Steel Sheets 500pc", amount: "$45,000", validity: "2024-03-01", status: "Accepted" },
  { id: "QT-2024-0041", rfqId: "RFQ-2024-011", vendor: "MetalWorks Ltd", description: "Steel Sheets 500pc", amount: "$47,500", validity: "2024-02-28", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  "Under Review": "bg-yellow-100 text-yellow-800",
  Shortlisted: "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function QuotationsPage() {
  const columns = [
    { key: "id", header: "Quotation ID" },
    { key: "rfqId", header: "RFQ ID" },
    { key: "vendor", header: "Vendor" },
    { key: "description", header: "Description" },
    { key: "amount", header: "Amount" },
    { key: "validity", header: "Valid Until" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof quotationsData[0]) => (
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
          <h1 className="text-2xl font-bold">Quotation Management</h1>
          <p className="text-gray-500">Compare and evaluate vendor quotations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + New RFQ
          </button>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search quotations..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={quotationsData} />
    </div>
  );
}
