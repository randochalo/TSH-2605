import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // EMS Stats
    const [
      totalAssets,
      activeAssets,
      maintenanceAssets,
      pendingRepairs,
      assetsByStatus,
      recentAssets,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'ACTIVE' } }),
      prisma.asset.count({ where: { status: 'MAINTENANCE' } }),
      prisma.repairOrder.count({ where: { status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.asset.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.asset.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
    ]);

    // HRMS Stats
    const [
      totalEmployees,
      activeEmployees,
      newHiresThisMonth,
      onLeaveEmployees,
      employeesByDepartment,
      recentEmployees,
      pendingLeaveRequests,
      pendingClaims,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.employee.count({ 
        where: { 
          dateJoined: { gte: startOfMonth },
          employmentStatus: 'ACTIVE',
        } 
      }),
      prisma.employee.count({ where: { employmentStatus: 'ON_LEAVE' } }),
      prisma.employee.groupBy({
        by: ['department'],
        where: { employmentStatus: 'ACTIVE' },
        _count: { department: true },
      }),
      prisma.employee.findMany({
        where: { employmentStatus: 'ACTIVE' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.claim.count({ where: { status: 'PENDING_APPROVAL' } }),
    ]);

    // PS Stats
    const [
      pendingPRs,
      totalVendors,
      openPOs,
      totalBudget,
      monthlySpending,
      prsByStatus,
      posByStatus,
    ] = await Promise.all([
      prisma.purchaseRequisition.count({ where: { status: { in: ['DRAFT', 'PENDING_APPROVAL'] } } }),
      prisma.vendor.count(),
      prisma.purchaseOrder.count({ where: { status: { in: ['APPROVED', 'SENT_TO_VENDOR', 'PARTIALLY_RECEIVED'] } } }),
      prisma.budget.aggregate({
        where: { fiscalYear: now.getFullYear(), status: 'ACTIVE' },
        _sum: { totalBudget: true },
      }),
      prisma.purchaseOrder.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { not: 'CANCELLED' },
        },
        _sum: { totalAmount: true },
      }),
      prisma.purchaseRequisition.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.purchaseOrder.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // Get upcoming maintenance
    const upcomingMaintenance = await prisma.maintenanceSchedule.findMany({
      where: {
        nextDueAt: { lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      },
      take: 5,
      orderBy: { nextDueAt: 'asc' },
    });

    // Get recent activities (simplified)
    const recentActivities = [
      { type: 'info', message: 'Dashboard data refreshed', timestamp: now.toISOString() },
    ];

    res.json({
      ems: {
        totalAssets,
        activeAssets,
        maintenanceAssets,
        pendingRepairs,
        assetsByStatus,
        recentAssets,
      },
      hrms: {
        totalEmployees,
        activeEmployees,
        newHiresThisMonth,
        onLeaveEmployees,
        employeesByDepartment,
        recentEmployees,
        pendingLeaveRequests,
        pendingClaims,
      },
      ps: {
        pendingPRs,
        totalVendors,
        openPOs,
        totalBudget: totalBudget._sum.totalBudget || 0,
        monthlySpending: monthlySpending._sum.totalAmount || 0,
        prsByStatus,
        posByStatus,
      },
      upcomingMaintenance,
      recentActivities,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
