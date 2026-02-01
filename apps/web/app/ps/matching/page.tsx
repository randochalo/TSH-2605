import { DataTable } from "../../components/DataTable";

const matchingData = [
  { id: "3W-0234", poId: "PO-2024-0188", invoiceId: "INV-45892", grId: "GR-2024-0234", vendor: "ABC Office Supplies", poAmount: "$3,450", invoiceAmount: "$3,450", status: "Matched" },
  { id: "3W-0233", poId: "PO-2024-0187", invoiceId: "INV-45891", grId: "GR-2024-0233", vendor: "Industrial Metals Inc", poAmount: "$45,000", invoiceAmount: "$27,000", status: "Partial Match" },
  { id: "3W-0232", poId: "PO-2024-0185", invoiceId: "INV-45890", grId: "GR-2024-0232", vendor: "Global Logistics", poAmount: "$8,500", invoiceAmount: "$8,500", status: "Matched" },
  { id: "3W-0231", poId: "PO-2024-0186", invoiceId: "INV-45889", grId: "GR-2024-0231", vendor: "Safety First Corp", poAmount: "$2,400", invoiceAmount: "$2,500", status: "Exception" },
  { id: "3W-0230", poId: "PO-2024-0184", invoiceId: "INV-45888", grId: "GR-2024-0230", vendor: "Dell Technologies", poAmount: "$6,800", invoiceAmount: "$6,800", status: "Matched" },
];

const statusColors: Record<string, string> = {
  Matched: "bg-green-100 text-green-800",
  "Partial Match": "bg-yellow-100 text-yellow-800",
  Exception: "bg-red-100 text-red-800",
};

export default function MatchingPage() {
  const columns = [
    { key: "id", header: "Match ID" },
    { key: "poId", header: "PO" },
    { key: "invoiceId", header: "Invoice" },
    { key: "grId", header: "GR" },
    { key: "vendor", header: "Vendor" },
    { key: "poAmount", header: "PO Amount" },
    {
      key: "invoiceAmount",
      header: "Invoice Amount",
      render: (item: typeof matchingData[0]) => (
        <span className={item.poAmount !== item.invoiceAmount ? "text-red-600 font-medium" : ""}>
          {item.invoiceAmount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: typeof matchingData[0]) => (
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
          <h1 className="text-2xl font-bold">3-Way Matching</h1>
          <p className="text-gray-500">Match purchase orders, receipts, and invoices</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          📥 Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Matched</p>
          <p className="text-2xl font-bold">234</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Partial Match</p>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Exceptions</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search matches..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={matchingData} />
    </div>
  );
}
