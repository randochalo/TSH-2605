import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all recruitment requisitions
router.get('/requisitions', async (req, res) => {
  try {
    const { 
      status,
      department,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (status) where.status = status;
    if (department) where.department = department;

    const [requisitions, total] = await Promise.all([
      prisma.recruitmentRequisition.findMany({
        where,
        include: {
          _count: {
            select: { 
              candidates: true,
              interviews: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.recruitmentRequisition.count({ where }),
    ]);

    res.json({
      data: requisitions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching requisitions:', error);
    res.status(500).json({ error: 'Failed to fetch requisitions' });
  }
});

// Get recruitment requisition by ID
router.get('/requisitions/:id', async (req, res) => {
  try {
    const requisition = await prisma.recruitmentRequisition.findUnique({
      where: { id: req.params.id },
      include: {
        candidates: {
          orderBy: { appliedAt: 'desc' },
        },
        interviews: {
          include: {
            candidate: true,
            employee: true,
          },
        },
      },
    });

    if (!requisition) {
      return res.status(404).json({ error: 'Requisition not found' });
    }

    res.json(requisition);
  } catch (error) {
    console.error('Error fetching requisition:', error);
    res.status(500).json({ error: 'Failed to fetch requisition' });
  }
});

// Create recruitment requisition
router.post('/requisitions', async (req, res) => {
  try {
    const data = req.body;
    
    // Generate requisition number
    const date = new Date();
    const year = date.getFullYear();
    const count = await prisma.recruitmentRequisition.count({
      where: { requestedAt: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } },
    });
    data.requisitionNumber = `REQ-${year}-${(count + 1).toString().padStart(4, '0')}`;

    const requisition = await prisma.recruitmentRequisition.create({
      data,
    });
    res.status(201).json(requisition);
  } catch (error) {
    console.error('Error creating requisition:', error);
    res.status(500).json({ error: 'Failed to create requisition' });
  }
});

// Update recruitment requisition
router.put('/requisitions/:id', async (req, res) => {
  try {
    const requisition = await prisma.recruitmentRequisition.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(requisition);
  } catch (error) {
    console.error('Error updating requisition:', error);
    res.status(500).json({ error: 'Failed to update requisition' });
  }
});

// Approve requisition
router.post('/requisitions/:id/approve', async (req, res) => {
  try {
    const { approvedBy } = req.body;

    const requisition = await prisma.recruitmentRequisition.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
      },
    });

    res.json(requisition);
  } catch (error) {
    console.error('Error approving requisition:', error);
    res.status(500).json({ error: 'Failed to approve requisition' });
  }
});

// Close requisition
router.post('/requisitions/:id/close', async (req, res) => {
  try {
    const { closedBy } = req.body;

    const requisition = await prisma.recruitmentRequisition.update({
      where: { id: req.params.id },
      data: {
        status: 'CLOSED',
        closedBy,
        closedAt: new Date(),
      },
    });

    res.json(requisition);
  } catch (error) {
    console.error('Error closing requisition:', error);
    res.status(500).json({ error: 'Failed to close requisition' });
  }
});

// Delete recruitment requisition
router.delete('/requisitions/:id', async (req, res) => {
  try {
    await prisma.recruitmentRequisition.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting requisition:', error);
    res.status(500).json({ error: 'Failed to delete requisition' });
  }
});

// Get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const { 
      requisitionId,
      status,
      source,
      search,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (requisitionId) where.requisitionId = requisitionId;
    if (status) where.status = status;
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          requisition: {
            select: {
              id: true,
              requisitionNumber: true,
              position: true,
              department: true,
            },
          },
          _count: {
            select: { interviews: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.candidate.count({ where }),
    ]);

    res.json({
      data: candidates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Get candidate by ID
router.get('/candidates/:id', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: req.params.id },
      include: {
        requisition: true,
        interviews: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

// Create candidate
router.post('/candidates', async (req, res) => {
  try {
    const candidate = await prisma.candidate.create({
      data: req.body,
      include: {
        requisition: {
          select: {
            id: true,
            requisitionNumber: true,
            position: true,
            department: true,
          },
        },
      },
    });
    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

// Update candidate
router.put('/candidates/:id', async (req, res) => {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        requisition: {
          select: {
            id: true,
            requisitionNumber: true,
            position: true,
            department: true,
          },
        },
      },
    });
    res.json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// Delete candidate
router.delete('/candidates/:id', async (req, res) => {
  try {
    await prisma.candidate.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

// Get all interviews
router.get('/interviews', async (req, res) => {
  try {
    const { 
      requisitionId,
      candidateId,
      status,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (requisitionId) where.requisitionId = requisitionId;
    if (candidateId) where.candidateId = candidateId;
    if (status) where.status = status;

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          requisition: {
            select: {
              id: true,
              requisitionNumber: true,
              position: true,
              department: true,
            },
          },
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.interview.count({ where }),
    ]);

    res.json({
      data: interviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

// Get interview by ID
router.get('/interviews/:id', async (req, res) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id },
      include: {
        requisition: true,
        candidate: true,
        employee: true,
      },
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
});

// Create interview
router.post('/interviews', async (req, res) => {
  try {
    const interview = await prisma.interview.create({
      data: req.body,
      include: {
        requisition: {
          select: {
            id: true,
            requisitionNumber: true,
            position: true,
            department: true,
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
          },
        },
      },
    });
    res.status(201).json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

// Update interview
router.put('/interviews/:id', async (req, res) => {
  try {
    const interview = await prisma.interview.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        requisition: true,
        candidate: true,
        employee: true,
      },
    });
    res.json(interview);
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({ error: 'Failed to update interview' });
  }
});

// Complete interview
router.post('/interviews/:id/complete', async (req, res) => {
  try {
    const { technicalScore, communicationScore, culturalFitScore, overallScore, 
            feedback, recommendation } = req.body;

    const interview = await prisma.interview.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        conductedAt: new Date(),
        technicalScore,
        communicationScore,
        culturalFitScore,
        overallScore,
        feedback,
        recommendation,
      },
      include: {
        requisition: true,
        candidate: true,
        employee: true,
      },
    });

    res.json(interview);
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
});

// Delete interview
router.delete('/interviews/:id', async (req, res) => {
  try {
    await prisma.interview.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ error: 'Failed to delete interview' });
  }
});

// Get recruitment statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalRequisitions,
      requisitionsByStatus,
      openPositions,
      filledPositions,
      totalCandidates,
      candidatesByStatus,
      totalInterviews,
      upcomingInterviews,
    ] = await Promise.all([
      prisma.recruitmentRequisition.count(),
      prisma.recruitmentRequisition.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.recruitmentRequisition.aggregate({
        where: { status: 'APPROVED' },
        _sum: { numberOfPositions: true },
      }),
      prisma.recruitmentRequisition.aggregate({
        _sum: { positionsFilled: true },
      }),
      prisma.candidate.count(),
      prisma.candidate.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.interview.count(),
      prisma.interview.count({
        where: {
          status: 'SCHEDULED',
          scheduledAt: { gte: new Date() },
        },
      }),
    ]);

    res.json({
      totalRequisitions,
      requisitionsByStatus,
      openPositions: openPositions._sum.numberOfPositions || 0,
      filledPositions: filledPositions._sum.positionsFilled || 0,
      totalCandidates,
      candidatesByStatus,
      totalInterviews,
      upcomingInterviews,
    });
  } catch (error) {
    console.error('Error fetching recruitment statistics:', error);
    res.status(500).json({ error: 'Failed to fetch recruitment statistics' });
  }
});

export default router;
