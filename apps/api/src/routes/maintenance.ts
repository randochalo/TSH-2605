import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all maintenance records
router.get('/', async (req, res) => {
  try {
    const { 
      assetId, 
      status, 
      priority,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (assetId) where.assetId = assetId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [records, total] = await Promise.all([
      prisma.maintenanceRecord.findMany({
        where,
        include: {
          asset: {
            include: { category: true },
          },
          schedule: true,
          _count: {
            select: { repairParts: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { scheduledStartAt: 'desc' },
      }),
      prisma.maintenanceRecord.count({ where }),
    ]);

    res.json({
      data: records,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

// Get maintenance schedules
router.get('/schedules', async (req, res) => {
  try {
    const schedules = await prisma.maintenanceSchedule.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { maintenanceRecords: true },
        },
      },
      orderBy: { nextDueAt: 'asc' },
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Get overdue maintenance
router.get('/overdue', async (req, res) => {
  try {
    const overdue = await prisma.maintenanceSchedule.findMany({
      where: {
        isActive: true,
        nextDueAt: { lt: new Date() },
      },
      include: {
        maintenanceRecords: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { nextDueAt: 'asc' },
    });
    res.json(overdue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overdue maintenance' });
  }
});

// Get upcoming maintenance
router.get('/upcoming', async (req, res) => {
  try {
    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    
    const upcoming = await prisma.maintenanceSchedule.findMany({
      where: {
        isActive: true,
        nextDueAt: {
          gte: new Date(),
          lte: next30Days,
        },
      },
      orderBy: { nextDueAt: 'asc' },
    });
    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming maintenance' });
  }
});

// Get maintenance record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await prisma.maintenanceRecord.findUnique({
      where: { id: req.params.id },
      include: {
        asset: {
          include: { category: true },
        },
        schedule: true,
        repairParts: {
          include: { sparePart: true },
        },
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance record' });
  }
});

// Create maintenance record
router.post('/', async (req, res) => {
  try {
    const record = await prisma.maintenanceRecord.create({
      data: req.body,
      include: {
        asset: true,
      },
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create maintenance record' });
  }
});

// Update maintenance record
router.put('/:id', async (req, res) => {
  try {
    const record = await prisma.maintenanceRecord.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance record' });
  }
});

// Get maintenance statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalRecords,
      byStatus,
      byPriority,
      completedThisMonth,
      overdueSchedules,
    ] = await Promise.all([
      prisma.maintenanceRecord.count(),
      prisma.maintenanceRecord.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.maintenanceRecord.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      prisma.maintenanceRecord.count({
        where: {
          status: 'COMPLETED',
          completedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.maintenanceSchedule.count({
        where: {
          isActive: true,
          nextDueAt: { lt: new Date() },
        },
      }),
    ]);

    res.json({
      totalRecords,
      byStatus,
      byPriority,
      completedThisMonth,
      overdueSchedules,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;