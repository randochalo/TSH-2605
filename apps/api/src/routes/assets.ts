import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all assets with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      category, 
      branch, 
      location, 
      condition,
      search,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (status) where.status = status;
    if (category) where.categoryId = category;
    if (branch) where.branchId = branch;
    if (location) where.locationId = location;
    if (condition) where.condition = condition;
    if (search) {
      where.OR = [
        { assetNumber: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } },
        { serialNumber: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          category: true,
          location: true,
          branch: true,
          _count: {
            select: {
              maintenanceRecords: true,
              repairOrders: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    res.json({
      data: assets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Get asset by ID
router.get('/:id', async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        location: true,
        branch: true,
        maintenanceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        repairOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        warranties: true,
        depreciationEntries: {
          orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
          take: 12,
        },
      },
    });

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

// Create asset
router.post('/', async (req, res) => {
  try {
    const asset = await prisma.asset.create({
      data: req.body,
      include: {
        category: true,
        location: true,
        branch: true,
      },
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        category: true,
        location: true,
        branch: true,
      },
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

// Delete asset
router.delete('/:id', async (req, res) => {
  try {
    await prisma.asset.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Get asset categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.assetCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get asset locations
router.get('/meta/locations', async (req, res) => {
  try {
    const locations = await prisma.assetLocation.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get asset statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalAssets,
      assetsByStatus,
      assetsByCategory,
      assetsByCondition,
      recentAssets,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.asset.groupBy({
        by: ['categoryId'],
        _count: { categoryId: true },
      }),
      prisma.asset.groupBy({
        by: ['condition'],
        _count: { condition: true },
      }),
      prisma.asset.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
    ]);

    res.json({
      totalAssets,
      assetsByStatus,
      assetsByCategory,
      assetsByCondition,
      recentAssets,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;