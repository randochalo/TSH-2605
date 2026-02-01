import { DashboardCard } from "../../../components/DashboardCard";
import { DataTable } from "../../../components/DataTable";

const maintenanceHistory = [
  { id: "MNT-001", date: "2024-01-15", type: "Preventive", description: "Regular service", technician: "John Smith", cost: "$150" },
  { id: "MNT-015", date: "2023-10-20", type: "Preventive", description: "Filter replacement", technician: "Mike Johnson", cost: "$75" },
  { id: "MNT-023", date: "2023-07-12", type: "Corrective", description: "Cooling issue fix", technician: "Sarah Chen", cost: "$320" },
];

const repairHistory = [
  { id: "REP-008", date: "2023-03-10", issue: "Hard drive failure", status: "Completed", cost: "$450", vendor: "TechFix Inc" },
];

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch the asset data based on params.id
  const asset = {
    id: params.id || "AST-001",
    name: "Dell Laptop XPS 15",
    category: "IT Equipment",
    location: "HQ - Floor 3",
    status: "Active",
    purchaseDate: "2023-01-15",
    purchaseValue: "$1,899",
    currentValue: "$1,425",
    vendor: "Dell Technologies",
    warrantyExpiry: "2026-01-15",
    assignedTo: "Sarah Johnson",
    serialNumber: "SN-DL-78945612",
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4">
        <a href="/ems/assets" className="text-blue-600 hover:text-blue-800">← Back to Assets</a>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{asset.name}</h1>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              {asset.status}
            </span>
          </div>
          <p className="text-gray-500">{asset.id} • {asset.category}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📝 Edit
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🔧 Schedule Maintenance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Purchase Value"
          value={asset.purchaseValue}
          color="blue"
        />
        <DashboardCard
          title="Current Value"
          value={asset.currentValue}
          color="green"
        />
        <DashboardCard
          title="Warranty Until"
          value={asset.warrantyExpiry}
          color="yellow"
        />
        <DashboardCard
          title="Assigned To"
          value={asset.assignedTo}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Asset Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Asset ID</p>
                <p className="font-medium">{asset.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{asset.serialNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{asset.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendor</p>
              <p className="font-medium">{asset.vendor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Date</p>
              <p className="font-medium">{asset.purchaseDate}</p>
            </div>
          </div>
        </div>

        {/* Depreciation Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Depreciation</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Purchase Value</span>
              <span className="font-medium">$1,899</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Value</span>
              <span className="font-medium">$1,425</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Depreciation</span>
              <span className="font-medium text-red-600">-$474 (25%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Depreciation Method</span>
              <span className="font-medium">Straight Line</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Useful Life</span>
              <span className="font-medium">5 years</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">1 of 5 years elapsed</p>
          </div>
        </div>

        {/* Warranty Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Warranty Status</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">✓ Under Warranty</p>
              <p className="text-sm text-green-600 mt-1">730 days remaining</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Warranty Start</p>
              <p className="font-medium">2023-01-15</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Warranty End</p>
              <p className="font-medium">2026-01-15</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coverage Type</p>
              <p className="font-medium">Full Parts & Labor</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendor Support</p>
              <p className="font-medium">1-800-DELL-SUPPORT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Maintenance History</h2>
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "date", header: "Date" },
            { key: "type", header: "Type" },
            { key: "description", header: "Description" },
            { key: "technician", header: "Technician" },
            { key: "cost", header: "Cost" },
          ]}
          data={maintenanceHistory}
        />
      </div>

      {/* Repair History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Repair History</h2>
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "date", header: "Date" },
            { key: "issue", header: "Issue" },
            { key: "status", header: "Status" },
            { key: "cost", header: "Cost" },
            { key: "vendor", header: "Vendor" },
          ]}
          data={repairHistory}
        />
      </div>
    </div>
  );
}
