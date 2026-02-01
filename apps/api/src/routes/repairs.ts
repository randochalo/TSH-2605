import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all repair orders
router.get('/', async (req, res) => {
  try {
    const { 
      assetId, 
      status, 
      priority,
      isWarrantyClaim,
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
    if (isWarrantyClaim !== undefined) where.isWarrantyClaim = isWarrantyClaim === 'true';

    const [orders, total] = await Promise.all([
      prisma.repairOrder.findMany({
        where,
        include: {
          asset: {
            include: { category: true },
          },
          _count: {
            select: { repairParts: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { reportedAt: 'desc' },
      }),
      prisma.repairOrder.count({ where }),
    ]);

    res.json({
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repair orders' });
  }
});

// Get repair order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.repairOrder.findUnique({
      where: { id: req.params.id },
      include: {
        asset: {
          include: { category: true },
        },
        repairParts: {
          include: { sparePart: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Repair order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repair order' });
  }
});

// Create repair order
router.post('/', async (req, res) => {
  try {
    const order = await prisma.repairOrder.create({
      data: req.body,
      include: {
        asset: true,
      },
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create repair order' });
  }
});

// Update repair order
router.put('/:id', async (req, res) => {
  try {
    const order = await prisma.repairOrder.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update repair order' });
  }
});

// Get repair statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalRepairs,
      openRepairs,
      byStatus,
      byPriority,
      avgRepairTime,
      totalRepairCost,
    ] = await Promise.all([
      prisma.repairOrder.count(),
      prisma.repairOrder.count({
        where: {
          status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS'] },
        },
      }),
      prisma.repairOrder.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.repairOrder.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      prisma.repairOrder.aggregate({
        where: { status: 'CLOSED' },
        _avg: { laborHours: true },
      }),
      prisma.repairOrder.aggregate({
        _sum: { totalCost: true },
      }),
    ]);

    res.json({
      totalRepairs,
      openRepairs,
      byStatus,
      byPriority,
      avgRepairTime: avgRepairTime._avg.laborHours,
      totalRepairCost: totalRepairCost._sum.totalCost,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get top assets by repair cost
router.get('/stats/top-assets', async (req, res) => {
  try {
    const topAssets = await prisma.repairOrder.groupBy({
      by: ['assetId'],
      _sum: { totalCost: true },
      _count: { assetId: true },
      orderBy: { _sum: { totalCost: 'desc' } },
      take: 10,
    });

    const assetsWithDetails = await Promise.all(
      topAssets.map(async (item) => {
        const asset = await prisma.asset.findUnique({
          where: { id: item.assetId },
          select: { assetNumber: true, name: true, category: { select: { name: true } } },
        });
        return {
          ...item,
          asset,
        };
      })
    );

    res.json(assetsWithDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top assets' });
  }
});

export default router;