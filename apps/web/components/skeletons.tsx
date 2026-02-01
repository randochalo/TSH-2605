"use client";

import { motion } from "framer-motion";

// Skeleton for cards
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
      </div>
    </motion.div>
  );
}

// Skeleton for table rows
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="animate-pulse h-4 bg-slate-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}

// Skeleton for table
export function SkeletonTable({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="animate-pulse h-4 bg-slate-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton for stats cards
export function SkeletonStatsCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-24"></div>
          <div className="h-6 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for dashboard stats grid
export function SkeletonStatsGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatsCard key={i} />
      ))}
    </div>
  );
}

// Skeleton for form
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 animate-pulse">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-10 bg-slate-200 rounded w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-slate-200 rounded w-32 mt-4"></div>
    </div>
  );
}

// Skeleton for list items
export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for chart
export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 animate-pulse ${className}`}>
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-slate-200 rounded"></div>
    </div>
  );
}

// Combined page skeleton
export function SkeletonPage() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
      <SkeletonStatsGrid count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable rows={5} columns={5} />
    </div>
  );
}

// Content loading placeholder
export function ContentLoader({ 
  children, 
  isLoading,
  skeleton = <SkeletonPage />
}: { 
  children: React.ReactNode; 
  isLoading: boolean;
  skeleton?: React.ReactNode;
}) {
  if (isLoading) {
    return <>{skeleton}</>;
  }
  return <>{children}</>;
}
