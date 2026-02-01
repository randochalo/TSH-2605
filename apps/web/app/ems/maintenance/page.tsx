import { DataTable } from "../../../components/DataTable";

const maintenanceData = [
  { id: "MNT-001", asset: "Server Room AC", type: "Preventive", scheduledDate: "2024-01-20", status: "Scheduled", assignee: "John Smith" },
  { id: "MNT-002", asset: "CNC Machine #3", type: "Scheduled", scheduledDate: "2024-01-23", status: "Scheduled", assignee: "Mike Johnson" },
  { id: "MNT-003", asset: "Forklift #12", type: "Inspection", scheduledDate: "2024-01-25", status: "Pending", assignee: "David Lee" },
  { id: "MNT-004", asset: "UPS System B", type: "Preventive", scheduledDate: "2024-01-26", status: "Scheduled", assignee: "Sarah Chen" },
  { id: "MNT-005", asset: "Air Compressor", type: "Service", scheduledDate: "2024-02-01", status: "Scheduled", assignee: "Tom Wilson" },
  { id: "MNT-006", asset: "Generator #2", type: "Preventive", scheduledDate: "2024-02-05", status: "Scheduled", assignee: "John Smith" },
];

const statusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-gray-100 text-gray-800",
};

export default function MaintenancePage() {
  const columns = [
    { key: "id", header: "Maintenance ID" },
    { key: "asset", header: "Asset" },
    { key: "type", header: "Type" },
    { key: "scheduledDate", header: "Scheduled Date" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof maintenanceData[0]) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    { key: "assignee", header: "Assignee" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
          <p className="text-gray-500">Track preventive and scheduled maintenance</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Schedule Maintenance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Completed (This Month)</p>
          <p className="text-2xl font-bold">18</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>

      <DataTable columns={columns} data={maintenanceData} />
    </div>
  );
}
