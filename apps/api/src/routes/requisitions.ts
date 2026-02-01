import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all purchase requisitions
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      department,
      branch,
      priority,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (department) where.department = department;
    if (branch) where.branchId = branch;
    if (priority) where.priority = priority;

    const [prs, total] = await Promise.all([
      prisma.purchaseRequisition.findMany({
        where,
        include: {
          lines: true,
          approvals: true,
          _count: {
            select: { 
              lines: true,
              purchaseOrders: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.purchaseRequisition.count({ where }),
    ]);

    res.json({
      data: prs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase requisitions' });
  }
});

// Get PR by ID
router.get('/:id', async (req, res) => {
  try {
    const pr = await prisma.purchaseRequisition.findUnique({
      where: { id: req.params.id },
      include: {
        lines: true,
        approvals: {
          orderBy: { approverLevel: 'asc' },
        },
        purchaseOrders: {
          include: {
            lines: true,
          },
        },
      },
    });

    if (!pr) {
      return res.status(404).json({ error: 'Purchase requisition not found' });
    }

    res.json(pr);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase requisition' });
  }
});

// Create PR
router.post('/', async (req, res) => {
  try {
    const { lines, ...prData } = req.body;
    
    const pr = await prisma.purchaseRequisition.create({
      data: {
        ...prData,
        lines: {
          create: lines,
        },
      },
      include: {
        lines: true,
      },
    });
    
    res.status(201).json(pr);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase requisition' });
  }
});

// Update PR
router.put('/:id', async (req, res) => {
  try {
    const pr = await prisma.purchaseRequisition.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(pr);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update purchase requisition' });
  }
});

// Approve PR
router.post('/:id/approve', async (req, res) => {
  try {
    const { approverId, comments } = req.body;
    
    const pr = await prisma.purchaseRequisition.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvals: {
          create: {
            approverId,
            action: 'APPROVED',
            actionAt: new Date(),
            comments,
          },
        },
      },
    });
    
    res.json(pr);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve purchase requisition' });
  }
});

// Get PR statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalPRs,
      byStatus,
      pendingApproval,
      totalAmount,
      avgProcessingTime,
    ] = await Promise.all([
      prisma.purchaseRequisition.count(),
      prisma.purchaseRequisition.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.purchaseRequisition.count({
        where: { status: 'PENDING_APPROVAL' },
      }),
      prisma.purchaseRequisition.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.purchaseRequisition.findMany({
        where: {
          status: 'APPROVED',
          submittedAt: { not: null },
          approvedAt: { not: null },
        },
        select: {
          submittedAt: true,
          approvedAt: true,
        },
        take: 100,
      }),
    ]);

    // Calculate average processing time
    let avgTime = 0;
    if (avgProcessingTime.length > 0) {
      const totalTime = avgProcessingTime.reduce((sum, pr) => {
        if (pr.submittedAt && pr.approvedAt) {
          return sum + (new Date(pr.approvedAt).getTime() - new Date(pr.submittedAt).getTime());
        }
        return sum;
      }, 0);
      avgTime = totalTime / avgProcessingTime.length / (1000 * 60 * 60 * 24); // in days
    }

    res.json({
      totalPRs,
      byStatus,
      pendingApproval,
      totalAmount: totalAmount._sum.totalAmount,
      avgProcessingTime: avgTime.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;