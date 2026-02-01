"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DataTable } from "../../../components/DataTable";
import { FormModal } from "../../../components/FormModal";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface RecruitmentRequisition {
  id: string;
  requisitionNumber: string;
  position: string;
  department: string;
  employmentType: string;
  numberOfPositions: number;
  status: string;
  requestedAt: string;
  requestedBy: string;
  positionsFilled: number;
  _count?: {
    candidates: number;
  };
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  source: string;
  currentEmployer: string;
  currentPosition: string;
  yearsOfExperience: number;
  status: string;
  appliedAt: string;
  rating: number | null;
}

interface Stats {
  openPositions: number;
  totalApplicants: number;
  hiredThisMonth: number;
  avgTimeToFill: number;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  ON_HOLD: "bg-orange-100 text-orange-800",
  CLOSED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const candidateStatusColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-800",
  SCREENING: "bg-yellow-100 text-yellow-800",
  PHONE_INTERVIEW: "bg-blue-100 text-blue-800",
  INTERVIEW: "bg-purple-100 text-purple-800",
  ASSESSMENT: "bg-orange-100 text-orange-800",
  OFFER_PENDING: "bg-pink-100 text-pink-800",
  OFFER_ACCEPTED: "bg-green-100 text-green-800",
  OFFER_REJECTED: "bg-red-100 text-red-800",
  HIRED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

export default function RecruitmentPage() {
  const { fetchWithAuth } = useApi();
  const [requisitions, setRequisitions] = useState<RecruitmentRequisition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [view, setView] = useState<"requisitions" | "candidates">("requisitions");

  useEffect(() => {
    loadRecruitmentData();
    loadStats();
  }, []);

  const loadRecruitmentData = async () => {
    try {
      setIsLoading(true);
      const [reqRes, candRes] = await Promise.all([
        fetchWithAuth("/api/recruitment/requisitions?limit=50"),
        fetchWithAuth("/api/recruitment/candidates?limit=50"),
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequisitions(data.data);
      }
      if (candRes.ok) {
        const data = await candRes.json();
        setCandidates(data.data);
      }
    } catch (error) {
      console.error("Error loading recruitment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/api/recruitment/stats/overview");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleCreateRequisition = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchWithAuth("/api/recruitment/requisitions", {
        method: "POST",
        body: JSON.stringify({
          position: data.position,
          department: data.department,
          employmentType: data.employmentType,
          numberOfPositions: parseInt(data.numberOfPositions as string),
          justification: data.justification,
          requirements: data.requirements,
        }),
      });

      if (response.ok) {
        setIsRequisitionModalOpen(false);
        loadRecruitmentData();
        loadStats();
      }
    } catch (error) {
      console.error("Error creating requisition:", error);
    }
  };

  const handleAddCandidate = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchWithAuth("/api/recruitment/candidates", {
        method: "POST",
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          source: data.source,
          currentEmployer: data.currentEmployer,
          currentPosition: data.currentPosition,
          yearsOfExperience: parseFloat(data.yearsOfExperience as string),
        }),
      });

      if (response.ok) {
        setIsCandidateModalOpen(false);
        loadRecruitmentData();
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const requisitionColumns = [
    { key: "requisitionNumber", header: "Requisition ID" },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    { key: "employmentType", header: "Type", render: (item: RecruitmentRequisition) => item.employmentType.replace(/_/g, " ") },
    {
      key: "positions",
      header: "Positions",
      render: (item: RecruitmentRequisition) => (
        <span>
          {item.positionsFilled} / {item.numberOfPositions} filled
        </span>
      ),
    },
    {
      key: "applicants",
      header: "Applicants",
      render: (item: RecruitmentRequisition) => item._count?.candidates || 0,
    },
    {
      key: "requestedAt",
      header: "Posted",
      render: (item: RecruitmentRequisition) => new Date(item.requestedAt).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (item: RecruitmentRequisition) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status.replace(/_/g, " ")}
        </span>
      ),
    },
  ];

  const candidateColumns = [
    {
      key: "name",
      header: "Name",
      render: (item: Candidate) => `${item.firstName} ${item.lastName}`,
    },
    { key: "email", header: "Email" },
    {
      key: "currentPosition",
      header: "Current Position",
      render: (item: Candidate) => (
        <div>
          <p className="font-medium">{item.currentPosition || "-"}</p>
          <p className="text-xs text-gray-500">{item.currentEmployer || "-"}</p>
        </div>
      ),
    },
    {
      key: "experience",
      header: "Experience",
      render: (item: Candidate) => `${item.yearsOfExperience || 0} years`,
    },
    { key: "source", header: "Source" },
    {
      key: "rating",
      header: "Rating",
      render: (item: Candidate) => (
        <span className={`text-sm ${item.rating && item.rating >= 4 ? "text-green-600" : item.rating && item.rating >= 3 ? "text-yellow-600" : "text-gray-500"}`}>
          {item.rating ? "★".repeat(item.rating) : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Candidate) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${candidateStatusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status.replace(/_/g, " ")}
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
            onClick={() => setIsCandidateModalOpen(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            + Add Candidate
          </button>
          <button
            onClick={() => setIsRequisitionModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Requisition
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Open Positions</p>
          <p className="text-2xl font-bold">{stats?.openPositions || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Applicants</p>
          <p className="text-2xl font-bold">{stats?.totalApplicants || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Hired (This Month)</p>
          <p className="text-2xl font-bold">{stats?.hiredThisMonth || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg Time to Fill</p>
          <p className="text-2xl font-bold">{stats?.avgTimeToFill || 0} days</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView("requisitions")}
            className={`px-4 py-2 rounded-lg transition-colors ${view === "requisitions" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Requisitions
          </button>
          <button
            onClick={() => setView("candidates")}
            className={`px-4 py-2 rounded-lg transition-colors ${view === "candidates" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Candidates
          </button>
        </div>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable
          columns={view === "requisitions" ? requisitionColumns : candidateColumns}
          data={view === "requisitions" ? requisitions : candidates}
        />
      )}

      {/* New Requisition Modal */}
      <FormModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        title="Create Job Requisition"
        onSubmit={handleCreateRequisition}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Position Title</label>
            <input name="position" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select name="department" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Production">Production</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employment Type</label>
              <select name="employmentType" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Positions</label>
            <input name="numberOfPositions" type="number" min="1" defaultValue="1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Justification</label>
            <textarea name="justification" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} placeholder="Why is this position needed?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <textarea name="requirements" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} placeholder="Key qualifications and requirements" />
          </div>
        </div>
      </FormModal>

      {/* Add Candidate Modal */}
      <FormModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        title="Add Candidate"
        onSubmit={handleAddCandidate}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input name="firstName" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input name="lastName" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <select name="source" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="LinkedIn">LinkedIn</option>
              <option value="JobStreet">JobStreet</option>
              <option value="Referral">Referral</option>
              <option value="Direct">Direct Application</option>
              <option value="Recruitment Agency">Recruitment Agency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Employer</label>
            <input name="currentEmployer" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Position</label>
            <input name="currentPosition" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Years of Experience</label>
            <input name="yearsOfExperience" type="number" step="0.5" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
