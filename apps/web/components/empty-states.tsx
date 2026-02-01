"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Plus,
  Download,
  RefreshCw,
  Settings,
  X
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        {icon || <Search className="w-10 h-10 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-500 max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

export function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description={`We couldn't find any results for "${query}". Try adjusting your search terms.`}
      icon={<Search className="w-10 h-10 text-slate-400" />}
      action={
        <button
          onClick={onClear}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Search
        </button>
      }
    />
  );
}

export function EmptyList({
  title = "No items yet",
  description = "Get started by creating your first item.",
  onCreate,
  createLabel = "Create New"
}: {
  title?: string;
  description?: string;
  onCreate?: () => void;
  createLabel?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<Package className="w-10 h-10 text-slate-400" />}
      action={
        onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {createLabel}
          </button>
        )
      }
    />
  );
}

export function EmptyEmployees({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      title="No employees yet"
      description="Start building your team by adding your first employee."
      icon={<Users className="w-10 h-10 text-slate-400" />}
      action={
        onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        )
      }
    />
  );
}

export function EmptyAssets({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      title="No assets registered"
      description="Track your equipment by adding assets to the system."
      icon={<Package className="w-10 h-10 text-slate-400" />}
      action={
        onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        )
      }
    />
  );
}

export function EmptyDocuments({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      title="No documents yet"
      description="Upload documents to keep everything organized in one place."
      icon={<FileText className="w-10 h-10 text-slate-400" />}
      action={
        onUpload && (
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Upload Document
          </button>
        )
      }
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading this page.",
  onRetry,
  error
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  error?: Error | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-2">{description}</p>
      {error && (
        <p className="text-red-500 text-sm mb-4 max-w-sm">{error.message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}

export function ComingSoon({
  title = "Coming Soon",
  description = "This feature is under development. Check back soon!"
}: {
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<Settings className="w-10 h-10 text-slate-400" />}
    />
  );
}

export function FirstTimeGuide({
  steps,
  onDismiss
}: {
  steps: { title: string; description: string }[];
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Getting Started</h3>
          <p className="text-slate-600 mb-4">Follow these steps to get the most out of the system:</p>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
