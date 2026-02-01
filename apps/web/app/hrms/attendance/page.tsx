import { DataTable } from "../../components/DataTable";

const attendanceData = [
  { id: "EMP-001", name: "John Smith", date: "2024-01-19", checkIn: "08:55", checkOut: "17:30", status: "Present", hours: "8.5" },
  { id: "EMP-002", name: "Sarah Chen", date: "2024-01-19", checkIn: "08:45", checkOut: "17:45", status: "Present", hours: "9.0" },
  { id: "EMP-003", name: "Mike Johnson", date: "2024-01-19", checkIn: "09:05", checkOut: "18:00", status: "Present", hours: "8.9" },
  { id: "EMP-004", name: "Lisa Wang", date: "2024-01-19", checkIn: "08:30", checkOut: "17:15", status: "Present", hours: "8.8" },
  { id: "EMP-005", name: "David Lee", date: "2024-01-19", checkIn: "-", checkOut: "-", status: "Absent", hours: "0" },
  { id: "EMP-006", name: "Emma Wilson", date: "2024-01-19", checkIn: "-", checkOut: "-", status: "On Leave", hours: "0" },
];

const statusColors: Record<string, string> = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Late: "bg-orange-100 text-orange-800",
};

export default function AttendancePage() {
  const columns = [
    { key: "id", header: "Employee ID" },
    { key: "name", header: "Name" },
    { key: "date", header: "Date" },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out" },
    { key: "hours", header: "Hours" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof attendanceData[0]) => (
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
          <h1 className="text-2xl font-bold">Attendance Tracking</h1>
          <p className="text-gray-500">Monitor daily attendance and working hours</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Record Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Present Today</p>
          <p className="text-2xl font-bold">318</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Late Arrivals</p>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search attendance..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg" defaultValue="2024-01-19" />
      </div>

      <DataTable columns={columns} data={attendanceData} />
    </div>
  );
}
