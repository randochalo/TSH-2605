import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all claims with filters
router.get('/', async (req, res) => {
  try {
    const { 
      employeeId,
      status,
      claimType,
      startDate,
      endDate,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (claimType) where.claimType = claimType;
    if (startDate || endDate) {
      where.claimDate = {};
      if (startDate) where.claimDate.gte = new Date(startDate as string);
      if (endDate) where.claimDate.lte = new Date(endDate as string);
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              employeeNumber: true,
              firstName: true,
              lastName: true,
              fullName: true,
              department: true,
            },
          },
          lines: true,
          _count: {
            select: { lines: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.claim.count({ where }),
    ]);

    res.json({
      data: claims,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// Get claim by ID
router.get('/:id', async (req, res) => {
  try {
    const claim = await prisma.claim.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
        lines: true,
        approvals: true,
      },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

// Create claim
router.post('/', async (req, res) => {
  try {
    const { employeeId, claimType, claimDate, description, notes, lines } = req.body;

    // Generate claim number
    const date = new Date();
    const year = date.getFullYear();
    const count = await prisma.claim.count({
      where: { claimDate: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } },
    });
    const claimNumber = `CLM-${year}-${(count + 1).toString().padStart(5, '0')}`;

    // Calculate total amount
    const totalAmount = lines.reduce((sum: number, line: any) => sum + parseFloat(line.amount), 0);

    const claim = await prisma.claim.create({
      data: {
        employeeId,
        claimNumber,
        claimType,
        claimDate: new Date(claimDate),
        description,
        notes,
        totalAmount,
        receiptCount: lines.length,
        lines: {
          create: lines.map((line: any, index: number) => ({
            lineNumber: index + 1,
            expenseDate: new Date(line.expenseDate),
            category: line.category,
            description: line.description,
            amount: line.amount,
            gstAmount: line.gstAmount || 0,
            notes: line.notes,
          })),
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            fullName: true,
            department: true,
          },
        },
        lines: true,
      },
    });

    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// Update claim
router.put('/:id', async (req, res) => {
  try {
    const claim = await prisma.claim.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            fullName: true,
            department: true,
          },
        },
        lines: true,
      },
    });
    res.json(claim);
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ error: 'Failed to update claim' });
  }
});

// Submit claim for approval
router.post('/:id/submit', async (req, res) => {
  try {
    const claim = await prisma.claim.update({
      where: { id: req.params.id },
      data: {
        status: 'PENDING_APPROVAL',
        submittedAt: new Date(),
      },
      include: {
        employee: true,
        lines: true,
      },
    });

    res.json(claim);
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ error: 'Failed to submit claim' });
  }
});

// Approve claim
router.post('/:id/approve', async (req, res) => {
  try {
    const { approvedBy, approvalNotes } = req.body;

    const claim = await prisma.claim.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
        approvalNotes,
      },
      include: {
        employee: true,
        lines: true,
      },
    });

    res.json(claim);
  } catch (error) {
    console.error('Error approving claim:', error);
    res.status(500).json({ error: 'Failed to approve claim' });
  }
});

// Reject claim
router.post('/:id/reject', async (req, res) => {
  try {
    const { approvedBy, approvalNotes } = req.body;

    const claim = await prisma.claim.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        approvedBy,
        approvedAt: new Date(),
        approvalNotes,
      },
      include: {
        employee: true,
        lines: true,
      },
    });

    res.json(claim);
  } catch (error) {
    console.error('Error rejecting claim:', error);
    res.status(500).json({ error: 'Failed to reject claim' });
  }
});

// Process payment
router.post('/:id/pay', async (req, res) => {
  try {
    const { paidBy, paymentReference } = req.body;

    const claim = await prisma.claim.update({
      where: { id: req.params.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paidBy,
        paymentReference,
      },
      include: {
        employee: true,
        lines: true,
      },
    });

    res.json(claim);
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Delete claim
router.delete('/:id', async (req, res) => {
  try {
    await prisma.claim.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ error: 'Failed to delete claim' });
  }
});

// Get claims statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);

    const [
      totalClaims,
      claimsByStatus,
      claimsByType,
      totalAmount,
      pendingClaims,
    ] = await Promise.all([
      prisma.claim.count({
        where: { claimDate: { gte: startDate, lt: endDate } },
      }),
      prisma.claim.groupBy({
        by: ['status'],
        where: { claimDate: { gte: startDate, lt: endDate } },
        _count: { status: true },
      }),
      prisma.claim.groupBy({
        by: ['claimType'],
        where: { claimDate: { gte: startDate, lt: endDate } },
        _count: { claimType: true },
      }),
      prisma.claim.aggregate({
        where: { 
          claimDate: { gte: startDate, lt: endDate },
          status: { in: ['APPROVED', 'PAID'] },
        },
        _sum: { totalAmount: true },
      }),
      prisma.claim.count({
        where: { status: 'PENDING_APPROVAL' },
      }),
    ]);

    res.json({
      totalClaims,
      claimsByStatus,
      claimsByType,
      totalAmount: totalAmount._sum.totalAmount || 0,
      pendingClaims,
    });
  } catch (error) {
    console.error('Error fetching claims statistics:', error);
    res.status(500).json({ error: 'Failed to fetch claims statistics' });
  }
});

export default router;
