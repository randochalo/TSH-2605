"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const employeesData = [
  { id: "EMP-001", name: "John Smith", email: "john.smith@company.com", department: "IT", position: "Senior Developer", joinDate: "2020-03-15", status: "Active" },
  { id: "EMP-002", name: "Sarah Chen", email: "sarah.chen@company.com", department: "HR", position: "HR Manager", joinDate: "2019-06-01", status: "Active" },
  { id: "EMP-003", name: "Mike Johnson", email: "mike.j@company.com", department: "Production", position: "Production Lead", joinDate: "2018-11-20", status: "Active" },
  { id: "EMP-004", name: "Lisa Wang", email: "lisa.wang@company.com", department: "Marketing", position: "Marketing Director", joinDate: "2021-01-10", status: "Active" },
  { id: "EMP-005", name: "David Lee", email: "david.lee@company.com", department: "Finance", position: "Financial Analyst", joinDate: "2022-08-15", status: "Active" },
  { id: "EMP-006", name: "Emma Wilson", email: "emma.w@company.com", department: "Operations", position: "Operations Manager", joinDate: "2017-04-05", status: "On Leave" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Inactive: "bg-gray-100 text-gray-800",
};

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = employeesData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "id", header: "Employee ID" },
    {
      key: "name",
      header: "Name",
      render: (item: typeof employeesData[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {item.name.split(" ").map(n => n[0]).join("")}
          </div>
          <span>{item.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "position", header: "Position" },
    { key: "joinDate", header: "Join Date" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof employeesData[0]) => (
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
          <h1 className="text-2xl font-bold">Employee Database</h1>
          <p className="text-gray-500">Manage employee records and information</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold">342</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold">328</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold">14</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">New (This Month)</p>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={filteredData} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>IT</option>
                <option>HR</option>
                <option>Production</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>R&D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Join Date</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
