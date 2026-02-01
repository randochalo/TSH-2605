import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      category,
      search,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { companyName: { contains: search as string, mode: 'insensitive' } },
        { vendorCode: { contains: search as string, mode: 'insensitive' } },
        { contactEmail: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          _count: {
            select: { 
              purchaseOrders: true,
              evaluations: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { companyName: 'asc' },
      }),
      prisma.vendor.count({ where }),
    ]);

    res.json({
      data: vendors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: {
        evaluations: {
          orderBy: { evaluatedAt: 'desc' },
          take: 10,
        },
        purchaseOrders: {
          orderBy: { orderDate: 'desc' },
          take: 10,
          include: {
            lines: true,
          },
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// Create vendor
router.post('/', async (req, res) => {
  try {
    const vendor = await prisma.vendor.create({
      data: req.body,
    });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// Add vendor evaluation
router.post('/:id/evaluations', async (req, res) => {
  try {
    const evaluation = await prisma.vendorEvaluation.create({
      data: {
        ...req.body,
        vendorId: req.params.id,
      },
    });
    
    // Update vendor rating
    const evaluations = await prisma.vendorEvaluation.findMany({
      where: { vendorId: req.params.id },
    });
    
    const avgScore = evaluations.reduce((sum, e) => sum + Number(e.overallScore), 0) / evaluations.length;
    
    await prisma.vendor.update({
      where: { id: req.params.id },
      data: {
        evaluationScore: avgScore,
        lastEvaluatedAt: new Date(),
      },
    });
    
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create evaluation' });
  }
});

// Get vendor statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalVendors,
      byStatus,
      byCategory,
      topVendors,
    ] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.vendor.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      prisma.vendor.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { evaluationScore: 'desc' },
        take: 10,
      }),
    ]);

    res.json({
      totalVendors,
      byStatus,
      byCategory,
      topVendors,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;