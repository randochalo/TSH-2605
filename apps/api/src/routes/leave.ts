import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all leave requests with filters
router.get('/', async (req, res) => {
  try {
    const { 
      employeeId,
      status,
      leaveType,
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
    if (leaveType) where.leaveType = leaveType;
    if (startDate || endDate) {
      where.OR = [
        { startDate: {} },
        { endDate: {} },
      ];
      if (startDate) where.OR[0].startDate = { gte: new Date(startDate as string) };
      if (endDate) where.OR[1].endDate = { lte: new Date(endDate as string) };
    }

    const [requests, total] = await Promise.all([
      prisma.leaveRequest.findMany({
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
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leaveRequest.count({ where }),
    ]);

    res.json({
      data: requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// Get leave request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
});

// Create leave request
router.post('/', async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, numberOfDays, reason, contactDuringLeave } = req.body;

    // Check leave balance
    const year = new Date(startDate).getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveType_year: {
          employeeId,
          leaveType,
          year,
        },
      },
    });

    if (balance && balance.available < numberOfDays) {
      return res.status(400).json({ error: 'Insufficient leave balance' });
    }

    const request = await prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberOfDays,
        reason,
        contactDuringLeave,
        status: 'PENDING',
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
      },
    });

    // Update pending balance
    if (balance) {
      await prisma.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pending: balance.pending + numberOfDays,
          available: balance.available - numberOfDays,
        },
      });
    }

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

// Update leave request
router.put('/:id', async (req, res) => {
  try {
    const request = await prisma.leaveRequest.update({
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
      },
    });
    res.json(request);
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ error: 'Failed to update leave request' });
  }
});

// Approve leave request
router.post('/:id/approve', async (req, res) => {
  try {
    const { approvedBy, approvalNotes } = req.body;

    const request = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
        approvalNotes,
      },
      include: {
        employee: true,
      },
    });

    // Update leave balance
    const year = new Date(request.startDate).getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveType_year: {
          employeeId: request.employeeId,
          leaveType: request.leaveType,
          year,
        },
      },
    });

    if (balance) {
      await prisma.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pending: balance.pending - request.numberOfDays,
          taken: balance.taken + request.numberOfDays,
        },
      });
    }

    res.json(request);
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ error: 'Failed to approve leave request' });
  }
});

// Reject leave request
router.post('/:id/reject', async (req, res) => {
  try {
    const { approvedBy, approvalNotes } = req.body;

    const request = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        approvedBy,
        approvedAt: new Date(),
        approvalNotes,
      },
      include: {
        employee: true,
      },
    });

    // Restore leave balance
    const year = new Date(request.startDate).getFullYear();
    const balance = await prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveType_year: {
          employeeId: request.employeeId,
          leaveType: request.leaveType,
          year,
        },
      },
    });

    if (balance) {
      await prisma.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pending: balance.pending - request.numberOfDays,
          available: balance.available + request.numberOfDays,
        },
      });
    }

    res.json(request);
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ error: 'Failed to reject leave request' });
  }
});

// Delete leave request
router.delete('/:id', async (req, res) => {
  try {
    const request = await prisma.leaveRequest.findUnique({
      where: { id: req.params.id },
    });

    if (request && request.status === 'PENDING') {
      // Restore leave balance
      const year = new Date(request.startDate).getFullYear();
      const balance = await prisma.leaveBalance.findUnique({
        where: {
          employeeId_leaveType_year: {
            employeeId: request.employeeId,
            leaveType: request.leaveType,
            year,
          },
        },
      });

      if (balance) {
        await prisma.leaveBalance.update({
          where: { id: balance.id },
          data: {
            pending: balance.pending - request.numberOfDays,
            available: balance.available + request.numberOfDays,
          },
        });
      }
    }

    await prisma.leaveRequest.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ error: 'Failed to delete leave request' });
  }
});

// Get leave balances for an employee
router.get('/balances/:employeeId', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const balances = await prisma.leaveBalance.findMany({
      where: {
        employeeId: req.params.employeeId,
        year: parseInt(year as string),
      },
    });

    res.json(balances);
  } catch (error) {
    console.error('Error fetching leave balances:', error);
    res.status(500).json({ error: 'Failed to fetch leave balances' });
  }
});

// Get leave statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const [
      totalRequests,
      requestsByStatus,
      requestsByType,
      pendingRequests,
    ] = await Promise.all([
      prisma.leaveRequest.count({
        where: { startDate: { gte: new Date(`${year}-01-01`), lt: new Date(`${parseInt(year as string) + 1}-01-01`) } },
      }),
      prisma.leaveRequest.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.leaveRequest.groupBy({
        by: ['leaveType'],
        _count: { leaveType: true },
      }),
      prisma.leaveRequest.count({
        where: { status: 'PENDING' },
      }),
    ]);

    res.json({
      totalRequests,
      requestsByStatus,
      requestsByType,
      pendingRequests,
    });
  } catch (error) {
    console.error('Error fetching leave statistics:', error);
    res.status(500).json({ error: 'Failed to fetch leave statistics' });
  }
});

export default router;
