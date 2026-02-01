"use client";

import { useEffect, useState } from "react";
import { useApi } from "../contexts/AuthContext";
import { 
  DashboardCard,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
  SkeletonStatsGrid,
  SkeletonChart,
  ContentLoader,
  PageTransition,
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  QuickAction,
  DemoTip,
} from "../../components";
import { 
  Plus, 
  FileText, 
  Users, 
  Wrench, 
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  ems: {
    totalAssets: number;
    activeAssets: number;
    maintenanceAssets: number;
    pendingRepairs: number;
  };
  hrms: {
    totalEmployees: number;
    activeEmployees: number;
    newHiresThisMonth: number;
    onLeaveEmployees: number;
    pendingLeaveRequests: number;
    pendingClaims: number;
  };
  ps: {
    pendingPRs: number;
    totalVendors: number;
    openPOs: number;
    totalBudget: number;
    monthlySpending: number;
  };
  upcomingMaintenance: Array<{
    id: string;
    title: string;
    nextDueAt: string;
  }>;
  recentActivities: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

// Sample chart data - would come from API in real implementation
const spendingData = [
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 52000 },
  { month: "Mar", amount: 48000 },
  { month: "Apr", amount: 61000 },
  { month: "May", amount: 55000 },
  { month: "Jun", amount: 67000 },
];

const assetCategoryData = [
  { name: "IT Equipment", value: 35 },
  { name: "Machinery", value: 25 },
  { name: "Furniture", value: 20 },
  { name: "Vehicles", value: 15 },
  { name: "Other", value: 5 },
];

const employeeTrendData = [
  { month: "Jan", count: 145 },
  { month: "Feb", count: 148 },
  { month: "Mar", count: 152 },
  { month: "Apr", count: 155 },
  { month: "May", count: 158 },
  { month: "Jun", count: 162 },
];

export default function HomePage() {
  const { fetchWithAuth } = useApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/api/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Error loading dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
        <button 
          onClick={loadDashboardStats}
          className="ml-4 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500">Welcome back! Here&apos;s an overview of your enterprise.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadDashboardStats}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <ContentLoader
          isLoading={isLoading}
          skeleton={<SkeletonStatsGrid count={4} />}
        >
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.1}>
            <StaggerItem>
              <ScaleOnHover>
                <DashboardCard
                  title="Total Assets"
                  value={stats?.ems.totalAssets.toLocaleString() || "0"}
                  subtitle={`${stats?.ems.activeAssets || 0} active`}
                  trend="up"
                  trendValue="Real-time data"
                  icon="🔧"
                  color="blue"
                />
              </ScaleOnHover>
            </StaggerItem>
            <StaggerItem>
              <ScaleOnHover>
                <DashboardCard
                  title="Active PRs"
                  value={stats?.ps.pendingPRs.toString() || "0"}
                  subtitle="Pending approval"
                  trend="neutral"
                  trendValue="Procurement"
                  icon="📦"
                  color="green"
                />
              </ScaleOnHover>
            </StaggerItem>
            <StaggerItem>
              <ScaleOnHover>
                <DashboardCard
                  title="Total Employees"
                  value={stats?.hrms.totalEmployees.toLocaleString() || "0"}
                  subtitle={`${stats?.hrms.activeEmployees || 0} active`}
                  trend="up"
                  trendValue={`${stats?.hrms.newHiresThisMonth || 0} new this month`}
                  icon="👥"
                  color="purple"
                />
              </ScaleOnHover>
            </StaggerItem>
            <StaggerItem>
              <ScaleOnHover>
                <DashboardCard
                  title="Pending Tasks"
                  value={((stats?.hrms.pendingLeaveRequests || 0) + (stats?.hrms.pendingClaims || 0)).toString()}
                  subtitle="HR approvals needed"
                  trend="neutral"
                  trendValue="Action required"
                  icon="📋"
                  color="yellow"
                />
              </ScaleOnHover>
            </StaggerItem>
          </StaggerContainer>
        </ContentLoader>

        {/* Charts Row */}
        <ContentLoader
          isLoading={isLoading}
          skeleton={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonChart />
              <SkeletonChart />
            </div>
          }
        >
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartComponent
                data={spendingData}
                xKey="month"
                yKey="amount"
                title="Monthly Procurement Spending"
                color="#3b82f6"
              />
              <PieChartComponent
                data={assetCategoryData}
                title="Assets by Category"
                donut
              />
            </div>
          </FadeIn>
        </ContentLoader>

        {/* Quick Actions */}
        <FadeIn delay={0.3}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3" staggerDelay={0.05}>
              <StaggerItem>
                <Link href="/ems/assets">
                  <ScaleOnHover>
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Add Asset</span>
                    </div>
                  </ScaleOnHover>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/ps/requisitions">
                  <ScaleOnHover>
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-green-300 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Create PR</span>
                    </div>
                  </ScaleOnHover>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/hrms/employees">
                  <ScaleOnHover>
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Add Employee</span>
                    </div>
                  </ScaleOnHover>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/reports">
                  <ScaleOnHover>
                    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">View Reports</span>
                    </div>
                  </ScaleOnHover>
                </Link>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* Module Stats */}
        <ContentLoader
          isLoading={isLoading}
          skeleton={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          <FadeIn delay={0.4}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* EMS Stats */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    Equipment Management
                  </h2>
                  <Link href="/ems" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Active Assets</span>
                    <span className="font-semibold text-slate-900">{stats?.ems.activeAssets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">In Maintenance</span>
                    <span className="font-semibold text-amber-600">{stats?.ems.maintenanceAssets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Pending Repairs</span>
                    <span className="font-semibold text-red-600">{stats?.ems.pendingRepairs || 0}</span>
                  </div>
                </div>
              </div>

              {/* PS Stats */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Procurement
                  </h2>
                  <Link href="/ps" className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Open POs</span>
                    <span className="font-semibold text-slate-900">{stats?.ps.openPOs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Total Vendors</span>
                    <span className="font-semibold text-slate-900">{stats?.ps.totalVendors || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Monthly Spending</span>
                    <span className="font-semibold text-green-600">
                      RM {stats?.ps.monthlySpending.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* HRMS Stats */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Human Resources
                  </h2>
                  <Link href="/hrms" className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <LineChartComponent
                  data={employeeTrendData}
                  xKey="month"
                  yKey="count"
                  title=""
                  color="#8b5cf6"
                  area
                />
              </div>
            </div>
          </FadeIn>
        </ContentLoader>

        {/* Bottom Row */}
        <ContentLoader
          isLoading={isLoading}
          skeleton={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          <FadeIn delay={0.5}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Maintenance */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Maintenance</h2>
                <div className="space-y-3">
                  {stats?.upcomingMaintenance && stats.upcomingMaintenance.length > 0 ? (
                    stats.upcomingMaintenance.slice(0, 5).map((item, index) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg px-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-500">
                              Due: {new Date(item.nextDueAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Link href="/ems/maintenance">
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm py-4 text-center">No upcoming maintenance</p>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.slice(0, 5).map((activity, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.type === "CREATE" ? "bg-green-500" :
                          activity.type === "UPDATE" ? "bg-blue-500" :
                          activity.type === "DELETE" ? "bg-red-500" : "bg-slate-500"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{activity.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm py-4 text-center">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </ContentLoader>
      </div>
    </PageTransition>
  );
}

// Skeleton card for loader
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}
