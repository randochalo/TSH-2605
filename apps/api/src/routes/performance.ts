import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all performance reviews
router.get('/reviews', async (req, res) => {
  try {
    const { 
      employeeId,
      reviewerId,
      status,
      reviewPeriod,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (reviewerId) where.reviewedBy = reviewerId;
    if (status) where.status = status;
    if (reviewPeriod) where.reviewPeriod = reviewPeriod;

    const [reviews, total] = await Promise.all([
      prisma.performanceReview.findMany({
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
              position: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { reviewPeriod: 'desc' },
      }),
      prisma.performanceReview.count({ where }),
    ]);

    res.json({
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching performance reviews:', error);
    res.status(500).json({ error: 'Failed to fetch performance reviews' });
  }
});

// Get performance review by ID
router.get('/reviews/:id', async (req, res) => {
  try {
    const review = await prisma.performanceReview.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Performance review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching performance review:', error);
    res.status(500).json({ error: 'Failed to fetch performance review' });
  }
});

// Create performance review
router.post('/reviews', async (req, res) => {
  try {
    const review = await prisma.performanceReview.create({
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
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating performance review:', error);
    res.status(500).json({ error: 'Failed to create performance review' });
  }
});

// Update performance review
router.put('/reviews/:id', async (req, res) => {
  try {
    const review = await prisma.performanceReview.update({
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
    res.json(review);
  } catch (error) {
    console.error('Error updating performance review:', error);
    res.status(500).json({ error: 'Failed to update performance review' });
  }
});

// Complete performance review
router.post('/reviews/:id/complete', async (req, res) => {
  try {
    const { overallRating, performanceScore, competencyScore, managerComments, 
            achievements, areasForImprovement, goalsForNextPeriod,
            isPromotionRecommended, salaryAdjustmentPercent } = req.body;

    const review = await prisma.performanceReview.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        overallRating,
        performanceScore,
        competencyScore,
        managerComments,
        achievements,
        areasForImprovement,
        goalsForNextPeriod,
        isPromotionRecommended,
        salaryAdjustmentPercent,
        reviewDate: new Date(),
      },
      include: {
        employee: true,
      },
    });

    res.json(review);
  } catch (error) {
    console.error('Error completing performance review:', error);
    res.status(500).json({ error: 'Failed to complete performance review' });
  }
});

// Delete performance review
router.delete('/reviews/:id', async (req, res) => {
  try {
    await prisma.performanceReview.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting performance review:', error);
    res.status(500).json({ error: 'Failed to delete performance review' });
  }
});

// Get all performance goals
router.get('/goals', async (req, res) => {
  try {
    const { 
      employeeId,
      status,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const [goals, total] = await Promise.all([
      prisma.performanceGoal.findMany({
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
        orderBy: { targetDate: 'asc' },
      }),
      prisma.performanceGoal.count({ where }),
    ]);

    res.json({
      data: goals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching performance goals:', error);
    res.status(500).json({ error: 'Failed to fetch performance goals' });
  }
});

// Get performance goal by ID
router.get('/goals/:id', async (req, res) => {
  try {
    const goal = await prisma.performanceGoal.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
      },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Performance goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Error fetching performance goal:', error);
    res.status(500).json({ error: 'Failed to fetch performance goal' });
  }
});

// Create performance goal
router.post('/goals', async (req, res) => {
  try {
    const goal = await prisma.performanceGoal.create({
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
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating performance goal:', error);
    res.status(500).json({ error: 'Failed to create performance goal' });
  }
});

// Update performance goal
router.put('/goals/:id', async (req, res) => {
  try {
    const goal = await prisma.performanceGoal.update({
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
    res.json(goal);
  } catch (error) {
    console.error('Error updating performance goal:', error);
    res.status(500).json({ error: 'Failed to update performance goal' });
  }
});

// Complete performance goal
router.post('/goals/:id/complete', async (req, res) => {
  try {
    const { actualValue, progress = 100 } = req.body;

    const goal = await prisma.performanceGoal.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        progress,
        actualValue,
        completedAt: new Date(),
      },
      include: {
        employee: true,
      },
    });

    res.json(goal);
  } catch (error) {
    console.error('Error completing performance goal:', error);
    res.status(500).json({ error: 'Failed to complete performance goal' });
  }
});

// Delete performance goal
router.delete('/goals/:id', async (req, res) => {
  try {
    await prisma.performanceGoal.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting performance goal:', error);
    res.status(500).json({ error: 'Failed to delete performance goal' });
  }
});

// Get performance statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalReviews,
      reviewsByStatus,
      averageRating,
      totalGoals,
      goalsByStatus,
      pendingReviews,
    ] = await Promise.all([
      prisma.performanceReview.count(),
      prisma.performanceReview.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.performanceReview.aggregate({
        where: { status: 'COMPLETED' },
        _avg: { overallRating: true },
      }),
      prisma.performanceGoal.count(),
      prisma.performanceGoal.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.performanceReview.count({
        where: { status: { in: ['PENDING', 'SELF_REVIEW'] } },
      }),
    ]);

    res.json({
      totalReviews,
      reviewsByStatus,
      averageRating: averageRating._avg.overallRating || 0,
      totalGoals,
      goalsByStatus,
      pendingReviews,
    });
  } catch (error) {
    console.error('Error fetching performance statistics:', error);
    res.status(500).json({ error: 'Failed to fetch performance statistics' });
  }
});

export default router;
