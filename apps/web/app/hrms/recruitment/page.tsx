"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const recruitmentData = [
  { id: "REQ-2024-0023", position: "Senior Developer", department: "IT", applicants: 45, status: "Interviewing", posted: "2024-01-10" },
  { id: "REQ-2024-0022", position: "HR Coordinator", department: "HR", applicants: 28, status: "Screening", posted: "2024-01-08" },
  { id: "REQ-2024-0021", position: "Production Supervisor", department: "Production", applicants: 15, status: "Offer Extended", posted: "2023-12-20" },
  { id: "REQ-2024-0020", position: "Marketing Manager", department: "Marketing", applicants: 32, status: "Closed", posted: "2023-12-15" },
  { id: "REQ-2024-0019", position: "Financial Analyst", department: "Finance", applicants: 22, status: "Interviewing", posted: "2024-01-05" },
];

const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-800",
  Screening: "bg-yellow-100 text-yellow-800",
  Interviewing: "bg-purple-100 text-purple-800",
  "Offer Extended": "bg-orange-100 text-orange-800",
  Closed: "bg-green-100 text-green-800",
};

export default function RecruitmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "id", header: "Requisition ID" },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    { key: "applicants", header: "Applicants" },
    { key: "posted", header: "Posted Date" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof recruitmentData[0]) => (
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
          <h1 className="text-2xl font-bold">Recruitment Tracking</h1>
          <p className="text-gray-500">Manage job openings and hiring process</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Requisition
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Open Positions</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Applicants</p>
          <p className="text-2xl font-bold">245</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Hired (This Month)</p>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg Time to Fill</p>
          <p className="text-2xl font-bold">28 days</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search requisitions..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={recruitmentData} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job Requisition"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Position Title</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employment Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. $60,000 - $80,000" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
