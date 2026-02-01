import { DataTable } from "../../../components/DataTable";

const repairsData = [
  { id: "REP-001", asset: "Air Compressor AC-100", issue: "Motor failure", startDate: "2024-01-10", status: "In Progress", cost: "$850", priority: "High" },
  { id: "REP-002", asset: "Printer HP LJ-400", issue: "Paper jam sensor", startDate: "2024-01-12", status: "Pending", cost: "$120", priority: "Low" },
  { id: "REP-003", asset: "Conveyor Belt C3", issue: "Belt replacement", startDate: "2024-01-08", status: "In Progress", cost: "$2,400", priority: "High" },
  { id: "REP-004", asset: "Office Chair #45", issue: "Broken armrest", startDate: "2024-01-15", status: "Completed", cost: "$45", priority: "Low" },
  { id: "REP-005", asset: "Forklift FL-09", issue: "Hydraulic leak", startDate: "2024-01-14", status: "Pending", cost: "$680", priority: "Medium" },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-yellow-100 text-yellow-800",
  Pending: "bg-gray-100 text-gray-800",
  Completed: "bg-green-100 text-green-800",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

export default function RepairsPage() {
  const columns = [
    { key: "id", header: "Repair ID" },
    { key: "asset", header: "Asset" },
    { key: "issue", header: "Issue" },
    { key: "startDate", header: "Start Date" },
    {
      key: "priority",
      header: "Priority",
      render: (item: typeof repairsData[0]) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[item.priority]}`}>
          {item.priority}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: typeof repairsData[0]) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    { key: "cost", header: "Est. Cost" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Repair History</h1>
          <p className="text-gray-500">Track repairs and service requests</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + New Repair Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Active Repairs</p>
          <p className="text-2xl font-bold">7</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Completed (This Month)</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Cost (YTD)</p>
          <p className="text-2xl font-bold">$45,230</p>
        </div>
      </div>

      <DataTable columns={columns} data={repairsData} />
    </div>
  );
}
