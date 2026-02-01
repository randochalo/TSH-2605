"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  PauseCircle,
  PlayCircle,
  FileText,
  Truck,
  PackageCheck,
  CreditCard
} from "lucide-react";

type BadgeVariant = 
  | "default" 
  | "success" 
  | "warning" 
  | "error" 
  | "info" 
  | "neutral"
  | "primary";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
  primary: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export function StatusBadge({ 
  children, 
  variant = "default", 
  icon,
  pulse = false,
  className = ""
}: StatusBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {pulse && variant === "success" && (
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      )}
      {icon}
      {children}
    </motion.span>
  );
}

// Predefined status badges for common use cases
export function ActiveBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="success" icon={<PlayCircle className="w-3 h-3" />} pulse className={className}>
      Active
    </StatusBadge>
  );
}

export function InactiveBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="neutral" icon={<PauseCircle className="w-3 h-3" />} className={className}>
      Inactive
    </StatusBadge>
  );
}

export function PendingBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="warning" icon={<Clock className="w-3 h-3" />} className={className}>
      Pending
    </StatusBadge>
  );
}

export function ApprovedBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="success" icon={<CheckCircle className="w-3 h-3" />} className={className}>
      Approved
    </StatusBadge>
  );
}

export function RejectedBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="error" icon={<XCircle className="w-3 h-3" />} className={className}>
      Rejected
    </StatusBadge>
  );
}

export function DraftBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="neutral" icon={<FileText className="w-3 h-3" />} className={className}>
      Draft
    </StatusBadge>
  );
}

export function OverdueBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="error" icon={<AlertTriangle className="w-3 h-3" />} className={className}>
      Overdue
    </StatusBadge>
  );
}

// Asset status badges
export function AssetStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: BadgeVariant; icon: ReactNode }> = {
    active: { variant: "success", icon: <PlayCircle className="w-3 h-3" /> },
    maintenance: { variant: "warning", icon: <Clock className="w-3 h-3" /> },
    repair: { variant: "error", icon: <AlertTriangle className="w-3 h-3" /> },
    retired: { variant: "neutral", icon: <PauseCircle className="w-3 h-3" /> },
    disposed: { variant: "neutral", icon: <XCircle className="w-3 h-3" /> },
  };

  const config = statusMap[status.toLowerCase()] || { variant: "default", icon: null };
  
  return (
    <StatusBadge variant={config.variant} icon={config.icon}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </StatusBadge>
  );
}

// Purchase order status badges
export function POStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: BadgeVariant; icon: ReactNode }> = {
    draft: { variant: "neutral", icon: <FileText className="w-3 h-3" /> },
    pending: { variant: "warning", icon: <Clock className="w-3 h-3" /> },
    approved: { variant: "success", icon: <CheckCircle className="w-3 h-3" /> },
    ordered: { variant: "info", icon: <Truck className="w-3 h-3" /> },
    partially_received: { variant: "warning", icon: <PackageCheck className="w-3 h-3" /> },
    received: { variant: "success", icon: <PackageCheck className="w-3 h-3" /> },
    cancelled: { variant: "error", icon: <XCircle className="w-3 h-3" /> },
    paid: { variant: "primary", icon: <CreditCard className="w-3 h-3" /> },
  };

  const config = statusMap[status.toLowerCase().replace(" ", "_")] || { variant: "default", icon: null };
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  
  return (
    <StatusBadge variant={config.variant} icon={config.icon}>
      {label}
    </StatusBadge>
  );
}

// Leave status badges
export function LeaveStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, BadgeVariant> = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    cancelled: "neutral",
  };

  return (
    <StatusBadge variant={statusMap[status.toLowerCase()] || "default"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </StatusBadge>
  );
}

// Priority badges
export function PriorityBadge({ priority }: { priority: string }) {
  const priorityMap: Record<string, BadgeVariant> = {
    low: "neutral",
    medium: "info",
    high: "warning",
    urgent: "error",
  };

  return (
    <StatusBadge variant={priorityMap[priority.toLowerCase()] || "default"}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </StatusBadge>
  );
}

// Payment status badges
export function PaymentStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, BadgeVariant> = {
    unpaid: "error",
    partial: "warning",
    paid: "success",
    overdue: "error",
  };

  return (
    <StatusBadge variant={statusMap[status.toLowerCase()] || "default"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </StatusBadge>
  );
}
