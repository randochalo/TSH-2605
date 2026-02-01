import { DataTable } from "../../components/DataTable";

const performanceData = [
  { id: "EMP-001", name: "John Smith", department: "IT", period: "Q4 2023", rating: "Exceeds", score: 4.5, reviewer: "Sarah Chen" },
  { id: "EMP-002", name: "Sarah Chen", department: "HR", period: "Q4 2023", rating: "Exceeds", score: 4.8, reviewer: "Mike Johnson" },
  { id: "EMP-003", name: "Mike Johnson", department: "Production", period: "Q4 2023", rating: "Meets", score: 3.8, reviewer: "Lisa Wang" },
  { id: "EMP-004", name: "Lisa Wang", department: "Marketing", period: "Q4 2023", rating: "Outstanding", score: 4.9, reviewer: "David Lee" },
  { id: "EMP-005", name: "David Lee", department: "Finance", period: "Q4 2023", rating: "Meets", score: 3.5, reviewer: "John Smith" },
];

const ratingColors: Record<string, string> = {
  Outstanding: "bg-purple-100 text-purple-800",
  Exceeds: "bg-green-100 text-green-800",
  Meets: "bg-blue-100 text-blue-800",
  "Needs Improvement": "bg-yellow-100 text-yellow-800",
  Unsatisfactory: "bg-red-100 text-red-800",
};

export default function PerformancePage() {
  const columns = [
    { key: "id", header: "Employee ID" },
    { key: "name", header: "Name" },
    { key: "department", header: "Department" },
    { key: "period", header: "Review Period" },
    {
      key: "rating",
      header: "Rating",
      render: (item: typeof performanceData[0]) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ratingColors[item.rating]}`}>
          {item.rating}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (item: typeof performanceData[0]) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${item.score >= 4.5 ? "bg-purple-600" : item.score >= 3.5 ? "bg-green-600" : "bg-yellow-600"}`}
              style={{ width: `${(item.score / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm">{item.score}</span>
        </div>
      ),
    },
    { key: "reviewer", header: "Reviewer" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance Appraisal</h1>
          <p className="text-gray-500">Manage performance reviews and evaluations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + New Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Outstanding</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Exceeds</p>
          <p className="text-2xl font-bold">89</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Meets</p>
          <p className="text-2xl font-bold">156</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Needs Improvement</p>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search performance reviews..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <DataTable columns={columns} data={performanceData} />
    </div>
  );
}
