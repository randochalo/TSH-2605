"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../contexts/AuthContext";
import { DataTable } from "../../../components/DataTable";
import { FormModal } from "../../../components/FormModal";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface TrainingCourse {
  id: string;
  courseCode: string;
  title: string;
  provider: string;
  category: string;
  durationHours: number;
  costPerPerson: number;
  isActive: boolean;
}

interface TrainingEnrollment {
  id: string;
  course: {
    courseCode: string;
    title: string;
    provider: string;
  };
  employee: {
    fullName: string;
    employeeNumber: string;
  };
  enrollmentDate: string;
  status: string;
  score: number | null;
  result: string | null;
}

interface Stats {
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  totalTrainingHours: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-800",
  ENROLLED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-red-100 text-red-800",
};

export default function TrainingPage() {
  const { fetchWithAuth } = useApi();
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string }>>([]);
  const [view, setView] = useState<"courses" | "enrollments">("enrollments");

  useEffect(() => {
    loadTrainingData();
    loadStats();
    loadEmployees();
  }, []);

  const loadTrainingData = async () => {
    try {
      setIsLoading(true);
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetchWithAuth("/api/training/courses?limit=50"),
        fetchWithAuth("/api/training/enrollments?limit=50"),
      ]);

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.data);
      }
      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.data);
      }
    } catch (error) {
      console.error("Error loading training data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/api/training/stats/overview");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetchWithAuth("/api/employees?status=ACTIVE&limit=100");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data.map((e: any) => ({ id: e.id, fullName: e.fullName })));
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleCreateCourse = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchWithAuth("/api/training/courses", {
        method: "POST",
        body: JSON.stringify({
          courseCode: data.courseCode,
          title: data.title,
          provider: data.provider,
          category: data.category,
          durationHours: parseFloat(data.durationHours as string),
          costPerPerson: parseFloat(data.costPerPerson as string),
        }),
      });

      if (response.ok) {
        setIsCourseModalOpen(false);
        loadTrainingData();
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleEnroll = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      const response = await fetchWithAuth("/api/training/enrollments", {
        method: "POST",
        body: JSON.stringify({
          courseId: data.courseId,
          employeeId: data.employeeId,
          scheduledDate: data.scheduledDate,
        }),
      });

      if (response.ok) {
        setIsEnrollmentModalOpen(false);
        loadTrainingData();
        loadStats();
      }
    } catch (error) {
      console.error("Error enrolling employee:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const courseColumns = [
    { key: "courseCode", header: "Course Code" },
    { key: "title", header: "Title" },
    { key: "provider", header: "Provider" },
    { key: "category", header: "Category" },
    { key: "durationHours", header: "Duration (hrs)" },
    {
      key: "costPerPerson",
      header: "Cost/Person",
      render: (item: TrainingCourse) => formatCurrency(item.costPerPerson),
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: TrainingCourse) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const enrollmentColumns = [
    { key: "courseCode", header: "Course", render: (item: TrainingEnrollment) => item.course?.courseCode },
    {
      key: "courseTitle",
      header: "Title",
      render: (item: TrainingEnrollment) => (
        <div>
          <p className="font-medium">{item.course?.title}</p>
          <p className="text-xs text-gray-500">{item.course?.provider}</p>
        </div>
      ),
    },
    {
      key: "employee",
      header: "Employee",
      render: (item: TrainingEnrollment) => (
        <div>
          <p className="font-medium">{item.employee?.fullName}</p>
          <p className="text-xs text-gray-500">{item.employee?.employeeNumber}</p>
        </div>
      ),
    },
    {
      key: "enrollmentDate",
      header: "Enrolled",
      render: (item: TrainingEnrollment) => new Date(item.enrollmentDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (item: TrainingEnrollment) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
          {item.status.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "result",
      header: "Result",
      render: (item: TrainingEnrollment) => (
        <span className={item.result === "Pass" ? "text-green-600" : item.result === "Fail" ? "text-red-600" : "text-gray-500"}>
          {item.result || (item.score ? `${item.score}%` : "-")}
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
            onClick={() => setIsCourseModalOpen(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            + Add Course
          </button>
          <button
            onClick={() => setIsEnrollmentModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Enroll Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold">{stats?.scheduledCount || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold">{stats?.inProgressCount || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Completed (YTD)</p>
          <p className="text-2xl font-bold">{stats?.completedCount || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Training Hours</p>
          <p className="text-2xl font-bold">{stats?.totalTrainingHours?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView("enrollments")}
            className={`px-4 py-2 rounded-lg transition-colors ${view === "enrollments" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Enrollments
          </button>
          <button
            onClick={() => setView("courses")}
            className={`px-4 py-2 rounded-lg transition-colors ${view === "courses" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Courses
          </button>
        </div>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search training..."
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
          columns={view === "courses" ? courseColumns : enrollmentColumns}
          data={view === "courses" ? courses : enrollments}
        />
      )}

      {/* Add Course Modal */}
      <FormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Add Training Course"
        onSubmit={handleCreateCourse}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course Code</label>
            <input name="courseCode" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., TRG-001" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <input name="provider" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="Safety">Safety</option>
              <option value="Technical">Technical</option>
              <option value="Management">Management</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="IT Skills">IT Skills</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (hours)</label>
              <input name="durationHours" type="number" step="0.5" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Person (RM)</label>
              <input name="costPerPerson" type="number" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </FormModal>

      {/* Enroll Employee Modal */}
      <FormModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        title="Enroll Employee in Training"
        onSubmit={handleEnroll}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select name="employeeId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <select name="courseId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select course...</option>
              {courses.filter(c => c.isActive).map((course) => (
                <option key={course.id} value={course.id}>{course.courseCode} - {course.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Scheduled Date</label>
            <input name="scheduledDate" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
