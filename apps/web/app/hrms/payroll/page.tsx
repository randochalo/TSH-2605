import { DataTable } from "../../components/DataTable";

const payrollData = [
  { id: "EMP-001", name: "John Smith", department: "IT", basic: "$6,500", allowances: "$800", deductions: "$1,200", net: "$6,100" },
  { id: "EMP-002", name: "Sarah Chen", department: "HR", basic: "$7,200", allowances: "$900", deductions: "$1,400", net: "$6,700" },
  { id: "EMP-003", name: "Mike Johnson", department: "Production", basic: "$5,800", allowances: "$600", deductions: "$1,000", net: "$5,400" },
  { id: "EMP-004", name: "Lisa Wang", department: "Marketing", basic: "$8,000", allowances: "$1,200", deductions: "$1,600", net: "$7,600" },
  { id: "EMP-005", name: "David Lee", department: "Finance", basic: "$5,500", allowances: "$500", deductions: "$950", net: "$5,050" },
];

export default function PayrollPage() {
  const columns = [
    { key: "id", header: "Employee ID" },
    { key: "name", header: "Name" },
    { key: "department", header: "Department" },
    { key: "basic", header: "Basic Salary" },
    { key: "allowances", header: "Allowances" },
    { key: "deductions", header: "Deductions" },
    { key: "net", header: "Net Pay" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll Processing</h1>
          <p className="text-gray-500">Manage monthly payroll and salaries</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Process Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Payroll Period</p>
          <p className="text-2xl font-bold">Jan 2024</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Payroll</p>
          <p className="text-2xl font-bold">$1.89M</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Processed</p>
          <p className="text-2xl font-bold">312/342</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg. Salary</p>
          <p className="text-2xl font-bold">$5,520</p>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search payroll..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>January 2024</option>
          <option>December 2023</option>
          <option>November 2023</option>
        </select>
      </div>

      <DataTable columns={columns} data={payrollData} />
    </div>
  );
}
