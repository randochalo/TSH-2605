import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all employees with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      department, 
      branch, 
      employmentType,
      search,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (status) where.employmentStatus = status;
    if (department) where.department = department;
    if (branch) where.branchId = branch;
    if (employmentType) where.employmentType = employmentType;
    if (search) {
      where.OR = [
        { employeeNumber: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          branch: true,
          _count: {
            select: {
              leaveRequests: true,
              claims: true,
              performanceReviews: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      data: employees,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: {
        branch: true,
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
        attendance: {
          orderBy: { attendanceDate: 'desc' },
          take: 30,
        },
        leaveRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        leaveBalances: true,
        payrollEntries: {
          orderBy: { createdAt: 'desc' },
          take: 12,
          include: {
            period: true,
          },
        },
        claims: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        performanceReviews: {
          orderBy: { reviewPeriod: 'desc' },
          take: 5,
        },
        performanceGoals: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
        trainingEnrollments: {
          include: { course: true },
          orderBy: { enrollmentDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.fullName = `${data.firstName} ${data.lastName}`;
    
    const employee = await prisma.employee.create({
      data,
      include: {
        branch: true,
      },
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    if (data.firstName || data.lastName) {
      const current = await prisma.employee.findUnique({
        where: { id: req.params.id },
        select: { firstName: true, lastName: true },
      });
      const firstName = data.firstName || current?.firstName;
      const lastName = data.lastName || current?.lastName;
      data.fullName = `${firstName} ${lastName}`;
    }

    const employee = await prisma.employee.update({
      where: { id: req.params.id },
      data,
      include: {
        branch: true,
      },
    });
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Get employee statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      employeesByDepartment,
      employeesByStatus,
      recentHires,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.employee.groupBy({
        by: ['department'],
        _count: { department: true },
      }),
      prisma.employee.groupBy({
        by: ['employmentStatus'],
        _count: { employmentStatus: true },
      }),
      prisma.employee.findMany({
        where: { employmentStatus: 'ACTIVE' },
        orderBy: { dateJoined: 'desc' },
        take: 5,
        include: { branch: true },
      }),
    ]);

    // Get new hires this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newHiresThisMonth = await prisma.employee.count({
      where: { 
        dateJoined: { gte: startOfMonth },
        employmentStatus: 'ACTIVE',
      },
    });

    res.json({
      totalEmployees,
      activeEmployees,
      newHiresThisMonth,
      employeesByDepartment,
      employeesByStatus,
      recentHires,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get departments list
router.get('/meta/departments', async (req, res) => {
  try {
    const departments = await prisma.employee.groupBy({
      by: ['department'],
      where: { isActive: true },
      _count: { department: true },
    });
    res.json(departments.map(d => ({ name: d.department, count: d._count.department })));
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

export default router;
