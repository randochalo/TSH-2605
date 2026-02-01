"use client";

import { useState } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  actions,
  sortable = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey as keyof T];
    const bValue = b[sortKey as keyof T];
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                onClick={() => handleSort(String(column.key))}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                  sortable ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {sortable && sortKey === column.key && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-700">
                  {column.render
                    ? column.render(item)
                    : String((item[column.key as keyof T] as string) || "-")}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available</div>
      )}
    </div>
  );
}
