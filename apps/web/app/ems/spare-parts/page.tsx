"use client";

import { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { DataTable } from "../../../components/DataTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

// Spare Parts interface - will need to be updated when API endpoint is created
interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  reorderPoint: number;
  reorderQuantity: number;
  standardCost: number;
  inventory?: {
    quantityOnHand: number;
    quantityReserved: number;
    location: string;
  };
}

interface SparePartsResponse {
  data: SparePart[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Mock data for now - replace with API call when endpoint is ready
const mockSpareParts: SparePart[] = [
  { id: "1", partNumber: "OIL-FILTER-001", name: "Engine Oil Filter", category: "Filters", reorderPoint: 20, reorderQuantity: 100, standardCost: 25.50, inventory: { quantityOnHand: 45, quantityReserved: 5, location: "Warehouse A" } },
  { id: "2", partNumber: "AIR-FILTER-001", name: "Air Filter", category: "Filters", reorderPoint: 15, reorderQuantity: 80, standardCost: 45.00, inventory: { quantityOnHand: 8, quantityReserved: 2, location: "Warehouse A" } },
  { id: "3", partNumber: "BRAKE-PAD-001", name: "Brake Pad Set", category: "Brakes", reorderPoint: 10, reorderQuantity: 50, standardCost: 120.00, inventory: { quantityOnHand: 22, quantityReserved: 3, location: "Warehouse B" } },
  { id: "4", partNumber: "TIRE-295-80", name: "Tire 295/80R22.5", category: "Tires", reorderPoint: 8, reorderQuantity: 40, standardCost: 850.00, inventory: { quantityOnHand: 0, quantityReserved: 0, location: "Warehouse A" } },
  { id: "5", partNumber: "BATTERY-12V", name: "12V Battery", category: "Electrical", reorderPoint: 5, reorderQuantity: 20, standardCost: 350.00, inventory: { quantityOnHand: 18, quantityReserved: 2, location: "Warehouse B" } },
  { id: "6", partNumber: "BELT-SERP-001", name: "Serpentine Belt", category: "Engine", reorderPoint: 10, reorderQuantity: 30, standardCost: 85.00, inventory: { quantityOnHand: 35, quantityReserved: 0, location: "Warehouse A" } },
  { id: "7", partNumber: "HOSE-HYD-001", name: "Hydraulic Hose", category: "Hydraulics", reorderPoint: 12, reorderQuantity: 40, standardCost: 65.00, inventory: { quantityOnHand: 15, quantityReserved: 5, location: "Warehouse B" } },
  { id: "8", partNumber: "LIGHT-LED-001", name: "LED Headlight", category: "Electrical", reorderPoint: 6, reorderQuantity: 24, standardCost: 150.00, inventory: { quantityOnHand: 3, quantityReserved: 1, location: "Warehouse A" } },
];

function getStockStatus(part: SparePart): { status: string; color: string } {
  const qty = part.inventory?.quantityOnHand || 0;
  const reorderPoint = part.reorderPoint;
  
  if (qty === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
  if (qty <= reorderPoint) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
  return { status: "In Stock", color: "bg-green-100 text-green-800" };
}

export default function SparePartsPage() {
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // For now use mock data - replace with API call
  // const { data: response, loading, error } = useApi<SparePartsResponse>("/api/spare-parts");
  
  const loading = false;
  const error = null;
  
  let spareParts = mockSpareParts;
  
  // Apply filters
  if (filterCategory) {
    spareParts = spareParts.filter(p => p.category === filterCategory);
  }
  if (filterStatus) {
    spareParts = spareParts.filter(p => getStockStatus(p).status === filterStatus);
  }
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    spareParts = spareParts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.partNumber.toLowerCase().includes(query)
    );
  }

  // Calculate stats
  const totalSkus = mockSpareParts.length;
  const lowStock = mockSpareParts.filter(p => getStockStatus(p).status === "Low Stock").length;
  const outOfStock = mockSpareParts.filter(p => getStockStatus(p).status === "Out of Stock").length;
  const inventoryValue = mockSpareParts.reduce((sum, p) => 
    sum + (p.inventory?.quantityOnHand || 0) * p.standardCost, 0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(value);
  };

  const columns = [
    { key: "partNumber", header: "Part ID" },
    { key: "name", header: "Part Name" },
    { key: "category", header: "Category" },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: SparePart) => (
        <span>
          {item.inventory?.quantityOnHand || 0} 
          {item.inventory?.quantityReserved ? (
            <span className="text-gray-500 text-xs"> ({item.inventory.quantityReserved} reserved)</span>
          ) : null}
        </span>
      ),
    },
    { key: "reorderPoint", header: "Min. Level" },
    {
      key: "location",
      header: "Location",
      render: (item: SparePart) => item.inventory?.location || "-",
    },
    {
      key: "standardCost",
      header: "Unit Cost",
      render: (item: SparePart) => formatCurrency(item.standardCost),
    },
    {
      key: "status",
      header: "Status",
      render: (item: SparePart) => {
        const status = getStockStatus(item);
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
            {status.status}
          </span>
        );
      },
    },
  ];

  const categories = [...new Set(mockSpareParts.map(p => p.category))];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Spare Parts Inventory</h1>
          <p className="text-gray-500">Manage spare parts and consumables</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            📥 Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Part
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total SKUs</p>
          <p className="text-2xl font-bold">{totalSkus}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold">{lowStock}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold">{outOfStock}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Inventory Value</p>
          <p className="text-2xl font-bold">{formatCurrency(inventoryValue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading spare parts: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable columns={columns} data={spareParts} />
      )}
    </div>
  );
}
