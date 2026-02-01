import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all quotations
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      vendor,
      prId,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (vendor) where.vendorId = vendor;
    if (prId) where.prId = prId;

    const [quotations, total] = await Promise.all([
      prisma.quotation.findMany({
        where,
        include: {
          vendor: true,
          pr: {
            select: { prNumber: true, title: true },
          },
          lines: true,
        },
        skip,
        take: limitNum,
        orderBy: { quotationDate: 'desc' },
      }),
      prisma.quotation.count({ where }),
    ]);

    res.json({
      data: quotations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
});

// Get quotation by ID
router.get('/:id', async (req, res) => {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: req.params.id },
      include: {
        vendor: true,
        pr: true,
        lines: true,
      },
    });

    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
});

// Create quotation
router.post('/', async (req, res) => {
  try {
    const { lines, ...quotationData } = req.body;
    
    const quotation = await prisma.quotation.create({
      data: {
        ...quotationData,
        lines: {
          create: lines,
        },
      },
      include: {
        lines: true,
      },
    });
    
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quotation' });
  }
});

// Compare quotations for a PR
router.get('/compare/:prId', async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      where: { prId: req.params.prId },
      include: {
        vendor: true,
        lines: true,
      },
      orderBy: { totalAmount: 'asc' },
    });

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotation comparison' });
  }
});

// Accept quotation
router.post('/:id/accept', async (req, res) => {
  try {
    const quotation = await prisma.quotation.update({
      where: { id: req.params.id },
      data: {
        status: 'ACCEPTED',
        isSelected: true,
        selectionReason: req.body.reason,
      },
    });
    
    // Reject other quotations for same PR
    if (quotation.prId) {
      await prisma.quotation.updateMany({
        where: {
          prId: quotation.prId,
          id: { not: req.params.id },
        },
        data: {
          status: 'REJECTED',
        },
      });
    }
    
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept quotation' });
  }
});

export default router;