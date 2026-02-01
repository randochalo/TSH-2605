"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  Wrench,
  Package,
  Users,
  BarChart3,
  LogOut
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Equipment", href: "/ems", icon: Wrench },
  { title: "Procurement", href: "/ps", icon: Package },
  { title: "HRMS", href: "/hrms", icon: Users },
  { title: "Reports", href: "/reports", icon: BarChart3 },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏭</span>
          <span className="font-bold">TSH-2605</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 overflow-y-auto"
            >
              <div className="p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-blue-600 text-white" 
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-8 border-t border-slate-800">
                  <button className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white w-full">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile-optimized page padding
export function MobilePageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16 lg:pt-0 min-h-screen">
      {children}
    </div>
  );
}

// Touch-friendly button sizes
export function TouchButton({ 
  children, 
  onClick, 
  className = "",
  variant = "primary"
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary: "bg-blue-600 text-white active:bg-blue-700",
    secondary: "bg-slate-100 text-slate-700 active:bg-slate-200",
    danger: "bg-red-600 text-white active:bg-red-700",
    ghost: "text-slate-600 active:bg-slate-100",
  };

  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Mobile card component
export function MobileCard({ 
  children, 
  className = "",
  onClick
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200 p-4 shadow-sm ${onClick ? "cursor-pointer active:bg-slate-50" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Responsive table wrapper
export function ResponsiveTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  );
}

// Bottom action bar for mobile
export function MobileActionBar({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}
