import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      vendor,
      branch,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (vendor) where.vendorId = vendor;

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          vendor: true,
          pr: {
            select: { prNumber: true },
          },
          lines: true,
          goodsReceipts: {
            take: 5,
            orderBy: { receiptDate: 'desc' },
          },
          invoices: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
        skip,
        take: limitNum,
        orderBy: { orderDate: 'desc' },
      }),
      prisma.purchaseOrder.count({ where }),
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
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

// Get PO by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: {
        vendor: true,
        pr: true,
        lines: true,
        goodsReceipts: {
          include: { lines: true },
        },
        invoices: {
          include: { lines: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
});

// Create PO
router.post('/', async (req, res) => {
  try {
    const { lines, ...poData } = req.body;
    
    const order = await prisma.purchaseOrder.create({
      data: {
        ...poData,
        lines: {
          create: lines,
        },
      },
      include: {
        lines: true,
      },
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// Update PO
router.put('/:id', async (req, res) => {
  try {
    const order = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

// Get goods receipts
router.get('/:id/receipts', async (req, res) => {
  try {
    const receipts = await prisma.goodsReceipt.findMany({
      where: { poId: req.params.id },
      include: {
        lines: true,
      },
      orderBy: { receiptDate: 'desc' },
    });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// Create goods receipt
router.post('/:id/receipts', async (req, res) => {
  try {
    const { lines, ...receiptData } = req.body;
    
    const receipt = await prisma.goodsReceipt.create({
      data: {
        ...receiptData,
        poId: req.params.id,
        lines: {
          create: lines,
        },
      },
      include: {
        lines: true,
      },
    });
    
    // Update PO line quantities
    for (const line of lines) {
      if (line.poLineId) {
        await prisma.pOLine.update({
          where: { id: line.poLineId },
          data: {
            quantityReceived: {
              increment: line.quantityReceived,
            },
          },
        });
      }
    }
    
    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goods receipt' });
  }
});

// Get PO statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalPOs,
      byStatus,
      totalValue,
      avgOrderValue,
    ] = await Promise.all([
      prisma.purchaseOrder.count(),
      prisma.purchaseOrder.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.purchaseOrder.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.purchaseOrder.aggregate({
        _avg: { totalAmount: true },
      }),
    ]);

    res.json({
      totalPOs,
      byStatus,
      totalValue: totalValue._sum.totalAmount,
      avgOrderValue: avgOrderValue._avg.totalAmount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;