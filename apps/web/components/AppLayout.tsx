"use client";

import { useAuth } from "../app/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastProvider } from "./toast";
import { MobileNav, MobilePageWrapper } from "./mobile-nav";
import { DemoBadge, DemoWatermark, KeyboardShortcuts } from "./demo-mode";
import { usePathname } from "next/navigation";
import { PageTransition } from "./animations";

const keyboardShortcuts = [
  { key: "Ctrl + K", action: "Quick search" },
  { key: "Ctrl + N", action: "Create new item" },
  { key: "Ctrl + R", action: "Refresh data" },
  { key: "Ctrl + /", action: "Show shortcuts" },
  { key: "Esc", action: "Close modal / Go back" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page doesn't need the sidebar layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated, redirect to login will be handled by page or middleware
  if (!isAuthenticated) {
    // Use effect to redirect would be better, but for now just show login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Demo Mode Indicators */}
        <DemoBadge />
        <DemoWatermark />
        
        {/* Mobile Navigation */}
        <MobileNav />
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <MobilePageWrapper>
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </MobilePageWrapper>
        </div>
        
        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts shortcuts={keyboardShortcuts} />
      </div>
    </ToastProvider>
  );
}
