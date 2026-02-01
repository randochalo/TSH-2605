import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all training courses
router.get('/courses', async (req, res) => {
  try {
    const { 
      category,
      isActive,
      search,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { courseCode: { contains: search as string, mode: 'insensitive' } },
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.trainingCourse.findMany({
        where,
        include: {
          _count: {
            select: { enrollments: true },
          },
        },
        skip,
        take: limitNum,
        orderBy: { title: 'asc' },
      }),
      prisma.trainingCourse.count({ where }),
    ]);

    res.json({
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching training courses:', error);
    res.status(500).json({ error: 'Failed to fetch training courses' });
  }
});

// Get training course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await prisma.trainingCourse.findUnique({
      where: { id: req.params.id },
      include: {
        enrollments: {
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
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Training course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching training course:', error);
    res.status(500).json({ error: 'Failed to fetch training course' });
  }
});

// Create training course
router.post('/courses', async (req, res) => {
  try {
    const course = await prisma.trainingCourse.create({
      data: req.body,
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating training course:', error);
    res.status(500).json({ error: 'Failed to create training course' });
  }
});

// Update training course
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await prisma.trainingCourse.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(course);
  } catch (error) {
    console.error('Error updating training course:', error);
    res.status(500).json({ error: 'Failed to update training course' });
  }
});

// Delete training course
router.delete('/courses/:id', async (req, res) => {
  try {
    await prisma.trainingCourse.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting training course:', error);
    res.status(500).json({ error: 'Failed to delete training course' });
  }
});

// Get all enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const { 
      employeeId,
      courseId,
      status,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (courseId) where.courseId = courseId;
    if (status) where.status = status;

    const [enrollments, total] = await Promise.all([
      prisma.trainingEnrollment.findMany({
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
          course: true,
        },
        skip,
        take: limitNum,
        orderBy: { enrollmentDate: 'desc' },
      }),
      prisma.trainingEnrollment.count({ where }),
    ]);

    res.json({
      data: enrollments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching training enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch training enrollments' });
  }
});

// Get enrollment by ID
router.get('/enrollments/:id', async (req, res) => {
  try {
    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
        course: true,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

// Create enrollment
router.post('/enrollments', async (req, res) => {
  try {
    const enrollment = await prisma.trainingEnrollment.create({
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
        course: true,
      },
    });
    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

// Update enrollment
router.put('/enrollments/:id', async (req, res) => {
  try {
    const enrollment = await prisma.trainingEnrollment.update({
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
        course: true,
      },
    });
    res.json(enrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
});

// Complete enrollment
router.post('/enrollments/:id/complete', async (req, res) => {
  try {
    const { score, result, feedback, certificateNumber } = req.body;

    const enrollment = await prisma.trainingEnrollment.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        completionDate: new Date(),
        score,
        result,
        feedback,
        certificateNumber,
      },
      include: {
        employee: true,
        course: true,
      },
    });

    res.json(enrollment);
  } catch (error) {
    console.error('Error completing enrollment:', error);
    res.status(500).json({ error: 'Failed to complete enrollment' });
  }
});

// Delete enrollment
router.delete('/enrollments/:id', async (req, res) => {
  try {
    await prisma.trainingEnrollment.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

// Get training statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalCourses,
      activeCourses,
      totalEnrollments,
      enrollmentsByStatus,
      completedTrainings,
      upcomingTrainings,
    ] = await Promise.all([
      prisma.trainingCourse.count(),
      prisma.trainingCourse.count({ where: { isActive: true } }),
      prisma.trainingEnrollment.count(),
      prisma.trainingEnrollment.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.trainingEnrollment.count({ where: { status: 'COMPLETED' } }),
      prisma.trainingEnrollment.count({
        where: {
          status: 'ENROLLED',
          scheduledDate: { gte: new Date() },
        },
      }),
    ]);

    // Calculate completion rate
    const completionRate = totalEnrollments > 0 
      ? Math.round((completedTrainings / totalEnrollments) * 100) 
      : 0;

    res.json({
      totalCourses,
      activeCourses,
      totalEnrollments,
      enrollmentsByStatus,
      completedTrainings,
      upcomingTrainings,
      completionRate,
    });
  } catch (error) {
    console.error('Error fetching training statistics:', error);
    res.status(500).json({ error: 'Failed to fetch training statistics' });
  }
});

export default router;
