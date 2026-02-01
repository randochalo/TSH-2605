"use client";

import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { FormModal } from "../../components/FormModal";

const trainingData = [
  { id: "TR-2024-0045", title: "Leadership Skills 101", provider: "SkillSoft", startDate: "2024-02-01", endDate: "2024-02-03", participants: 12, status: "Scheduled" },
  { id: "TR-2024-0044", title: "AWS Cloud Practitioner", provider: "Amazon Web Services", startDate: "2024-01-20", endDate: "2024-01-24", participants: 8, status: "In Progress" },
  { id: "TR-2024-0043", title: "Safety Awareness", provider: "Internal", startDate: "2024-01-15", endDate: "2024-01-15", participants: 45, status: "Completed" },
  { id: "TR-2024-0042", title: "Project Management PMP", provider: "PMI", startDate: "2024-03-01", endDate: "2024-03-05", participants: 6, status: "Scheduled" },
  { id: "TR-2024-0041", title: "Excel Advanced", provider: "LinkedIn Learning", startDate: "2024-01-10", endDate: "2024-01-12", participants: 20, status: "Completed" },
];

const statusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function TrainingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "id", header: "Training ID" },
    { key: "title", header: "Title" },
    { key: "provider", header: "Provider" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    { key: "participants", header: "Participants" },
    {
      key: "status",
      header: "Status",
      render: (item: typeof trainingData[0]) => (
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
          <h1 className="text-2xl font-bold">Training Management</h1>
          <p className="text-gray-500">Manage employee training programs</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Schedule Training
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Completed (YTD)</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Training Hours</p>
          <p className="text-2xl font-bold">1,240</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search training..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={trainingData} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Training"
        onSubmit={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Training Title</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Participants</label>
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
