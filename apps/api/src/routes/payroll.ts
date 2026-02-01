import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all payroll periods
router.get('/periods', async (req, res) => {
  try {
    const { status, year, page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (year) where.year = parseInt(year as string);

    const [periods, total] = await Promise.all([
      prisma.payrollPeriod.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      }),
      prisma.payrollPeriod.count({ where }),
    ]);

    res.json({
      data: periods,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching payroll periods:', error);
    res.status(500).json({ error: 'Failed to fetch payroll periods' });
  }
});

// Get payroll period by ID
router.get('/periods/:id', async (req, res) => {
  try {
    const period = await prisma.payrollPeriod.findUnique({
      where: { id: req.params.id },
      include: {
        entries: {
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

    if (!period) {
      return res.status(404).json({ error: 'Payroll period not found' });
    }

    res.json(period);
  } catch (error) {
    console.error('Error fetching payroll period:', error);
    res.status(500).json({ error: 'Failed to fetch payroll period' });
  }
});

// Create payroll period
router.post('/periods', async (req, res) => {
  try {
    const { year, month, startDate, endDate, paymentDate, name } = req.body;

    // Auto-generate name if not provided
    const periodName = name || `${year}-${month.toString().padStart(2, '0')}`;

    const period = await prisma.payrollPeriod.create({
      data: {
        name: periodName,
        year,
        month,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        paymentDate: new Date(paymentDate),
      },
    });

    res.status(201).json(period);
  } catch (error) {
    console.error('Error creating payroll period:', error);
    res.status(500).json({ error: 'Failed to create payroll period' });
  }
});

// Process payroll
router.post('/periods/:id/process', async (req, res) => {
  try {
    const { processedBy } = req.body;

    // Get all active employees
    const employees = await prisma.employee.findMany({
      where: { employmentStatus: 'ACTIVE' },
    });

    const period = await prisma.payrollPeriod.findUnique({
      where: { id: req.params.id },
    });

    if (!period) {
      return res.status(404).json({ error: 'Payroll period not found' });
    }

    // Create payroll entries for each employee
    const entries = [];
    let totalGrossPay = 0;
    let totalDeductions = 0;
    let totalNetPay = 0;

    for (const employee of employees) {
      const basicSalary = employee.basicSalary?.toNumber() || 0;
      
      // Calculate statutory deductions (Malaysia rates)
      const epfEmployee = Math.round(basicSalary * 0.11 * 100) / 100; // 11% employee
      const epfEmployer = Math.round(basicSalary * 0.12 * 100) / 100; // 12% employer
      const socsoEmployee = Math.min(Math.round(basicSalary * 0.005 * 100) / 100, 19.75); // ~0.5% capped
      const socsoEmployer = Math.min(Math.round(basicSalary * 0.0175 * 100) / 100, 69.15); // ~1.75% capped
      const eisEmployee = Math.min(Math.round(basicSalary * 0.002 * 100) / 100, 8.00); // 0.2% capped
      const eisEmployer = Math.min(Math.round(basicSalary * 0.002 * 100) / 100, 8.00); // 0.2% capped
      
      // Simple PCB estimation (simplified)
      const pcb = Math.round(basicSalary * 0.05 * 100) / 100;

      const totalDeduction = epfEmployee + socsoEmployee + eisEmployee + pcb;
      const netPay = basicSalary - totalDeduction;

      const entry = await prisma.payrollEntry.create({
        data: {
          periodId: req.params.id,
          employeeId: employee.id,
          basicSalary,
          grossPay: basicSalary,
          epfEmployee,
          socsoEmployee,
          eisEmployee,
          pcb,
          totalDeductions: totalDeduction,
          netPay,
          epfEmployer,
          socsoEmployer,
          eisEmployer,
        },
      });

      entries.push(entry);
      totalGrossPay += basicSalary;
      totalDeductions += totalDeduction;
      totalNetPay += netPay;
    }

    // Update payroll period
    const updatedPeriod = await prisma.payrollPeriod.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        totalEmployees: employees.length,
        totalGrossPay,
        totalDeductions,
        totalNetPay,
        totalEpfEmployer: entries.reduce((sum, e) => sum + (e.epfEmployer?.toNumber() || 0), 0),
        totalEpfEmployee: entries.reduce((sum, e) => sum + (e.epfEmployee?.toNumber() || 0), 0),
        totalSocso: entries.reduce((sum, e) => sum + (e.socsoEmployee?.toNumber() || 0) + (e.socsoEmployer?.toNumber() || 0), 0),
        totalEis: entries.reduce((sum, e) => sum + (e.eisEmployee?.toNumber() || 0) + (e.eisEmployer?.toNumber() || 0), 0),
        totalPcb: entries.reduce((sum, e) => sum + (e.pcb?.toNumber() || 0), 0),
        processedBy,
        processedAt: new Date(),
      },
    });

    res.json({ period: updatedPeriod, entriesCreated: entries.length });
  } catch (error) {
    console.error('Error processing payroll:', error);
    res.status(500).json({ error: 'Failed to process payroll' });
  }
});

// Get payroll entries
router.get('/entries', async (req, res) => {
  try {
    const { periodId, employeeId, page = '1', limit = '20' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (periodId) where.periodId = periodId;
    if (employeeId) where.employeeId = employeeId;

    const [entries, total] = await Promise.all([
      prisma.payrollEntry.findMany({
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
          period: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payrollEntry.count({ where }),
    ]);

    res.json({
      data: entries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching payroll entries:', error);
    res.status(500).json({ error: 'Failed to fetch payroll entries' });
  }
});

// Get payroll entry by ID
router.get('/entries/:id', async (req, res) => {
  try {
    const entry = await prisma.payrollEntry.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
        period: true,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Payroll entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching payroll entry:', error);
    res.status(500).json({ error: 'Failed to fetch payroll entry' });
  }
});

// Get payroll statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const [
      totalPeriods,
      periodsByStatus,
      totalEmployees,
      monthlySummary,
    ] = await Promise.all([
      prisma.payrollPeriod.count({
        where: { year: parseInt(year as string) },
      }),
      prisma.payrollPeriod.groupBy({
        by: ['status'],
        where: { year: parseInt(year as string) },
        _count: { status: true },
      }),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.payrollPeriod.findMany({
        where: { 
          year: parseInt(year as string),
          status: 'COMPLETED',
        },
        orderBy: { month: 'asc' },
        select: {
          month: true,
          totalNetPay: true,
          totalEmployees: true,
        },
      }),
    ]);

    // Calculate YTD totals
    const ytdGrossPay = monthlySummary.reduce((sum, m) => sum + (m.totalNetPay?.toNumber() || 0), 0);

    res.json({
      totalPeriods,
      periodsByStatus,
      totalEmployees,
      monthlySummary,
      ytdGrossPay,
    });
  } catch (error) {
    console.error('Error fetching payroll statistics:', error);
    res.status(500).json({ error: 'Failed to fetch payroll statistics' });
  }
});

export default router;
