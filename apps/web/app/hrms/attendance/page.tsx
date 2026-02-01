"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DataTable } from "../../../components/DataTable";

interface AttendanceRecord {
  id: string;
  employee: {
    employeeNumber: string;
    fullName: string;
  };
  attendanceDate: string;
  clockInAt: string | null;
  clockOutAt: string | null;
  workedHours: number | null;
  status: string;
  isLate: boolean;
}

interface Stats {
  totalRecords: number;
  lateCount: number;
  todayAttendance: number;
}

const statusColors: Record<string, string> = {
  PRESENT: "bg-green-100 text-green-800",
  ABSENT: "bg-red-100 text-red-800",
  ON_LEAVE: "bg-yellow-100 text-yellow-800",
  REST_DAY: "bg-gray-100 text-gray-800",
  HOLIDAY: "bg-blue-100 text-blue-800",
};

export default function AttendancePage() {
  const { fetchWithAuth } = useApi();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadAttendance();
    loadStats();
  }, [selectedDate]);

  const loadAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`/api/attendance?limit=50&startDate=${selectedDate}&endDate=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data.data);
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/api/attendance/stats/overview");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const columns = [
    { 
      key: "employeeNumber", 
      header: "Employee ID",
      render: (item: AttendanceRecord) => item.employee?.employeeNumber || "-",
    },
    { 
      key: "name", 
      header: "Name",
      render: (item: AttendanceRecord) => item.employee?.fullName || "-",
    },
    { 
      key: "attendanceDate", 
      header: "Date",
      render: (item: AttendanceRecord) => new Date(item.attendanceDate).toLocaleDateString(),
    },
    { 
      key: "clockInAt", 
      header: "Check In",
      render: (item: AttendanceRecord) => formatTime(item.clockInAt),
    },
    { 
      key: "clockOutAt", 
      header: "Check Out",
      render: (item: AttendanceRecord) => formatTime(item.clockOutAt),
    },
    { 
      key: "workedHours", 
      header: "Hours",
      render: (item: AttendanceRecord) => item.workedHours?.toFixed(1) || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item: AttendanceRecord) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status}
        </span>
      ),
    },
  ];

  const presentCount = records.filter(r => r.status === "PRESENT").length;
  const onLeaveCount = records.filter(r => r.status === "ON_LEAVE").length;
  const absentCount = records.filter(r => r.status === "ABSENT").length;
  const lateCount = records.filter(r => r.isLate).length;

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
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold">{presentCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold">{absentCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold">{onLeaveCount}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Late Arrivals</p>
          <p className="text-2xl font-bold">{lateCount}</p>
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
        <input 
          type="date" 
          className="px-4 py-2 border border-gray-300 rounded-lg" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={records} />
      )}
    </div>
  );
}
