"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: "📊",
  },
  {
    title: "Equipment Management",
    href: "/ems",
    icon: "🔧",
    children: [
      { title: "Assets", href: "/ems/assets" },
      { title: "Maintenance", href: "/ems/maintenance" },
      { title: "Repairs", href: "/ems/repairs" },
      { title: "Warranty", href: "/ems/warranty" },
      { title: "Spare Parts", href: "/ems/spare-parts" },
    ],
  },
  {
    title: "Procurement",
    href: "/ps",
    icon: "📦",
    children: [
      { title: "Requisitions", href: "/ps/requisitions" },
      { title: "Vendors", href: "/ps/vendors" },
      { title: "Quotations", href: "/ps/quotations" },
      { title: "Purchase Orders", href: "/ps/orders" },
      { title: "Receipts", href: "/ps/receipts" },
      { title: "3-Way Matching", href: "/ps/matching" },
      { title: "Budgets", href: "/ps/budgets" },
    ],
  },
  {
    title: "HRMS",
    href: "/hrms",
    icon: "👥",
    children: [
      { title: "Employees", href: "/hrms/employees" },
      { title: "Attendance", href: "/hrms/attendance" },
      { title: "Leave", href: "/hrms/leave" },
      { title: "Payroll", href: "/hrms/payroll" },
      { title: "Claims", href: "/hrms/claims" },
      { title: "Performance", href: "/hrms/performance" },
      { title: "Training", href: "/hrms/training" },
      { title: "Recruitment", href: "/hrms/recruitment" },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "📈",
  },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState<string[]>(["Equipment Management", "Procurement", "HRMS"]);
  const pathname = usePathname();

  const toggleExpand = (title: string) => {
    setExpanded((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold">🏭 TSH-2605</h1>
        <p className="text-xs text-slate-400 mt-1">Enterprise Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors ${
                    pathname.startsWith(item.href) ? "bg-slate-800 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </span>
                  <span className="text-xs">
                    {expanded.includes(item.title) ? "▼" : "▶"}
                  </span>
                </button>
                {expanded.includes(item.title) && (
                  <div className="bg-slate-950">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-12 py-2 text-sm hover:bg-slate-800 transition-colors ${
                          pathname === child.href ? "text-blue-400 bg-slate-900" : "text-slate-300"
                        }`}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors ${
                  pathname === item.href ? "bg-slate-800 border-r-2 border-blue-500" : ""
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            JD
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
