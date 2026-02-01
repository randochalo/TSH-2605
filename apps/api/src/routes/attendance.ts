import { Router } from 'express';
import { prisma } from '@repo/database';

const router = Router();

// Get all attendance records with filters
router.get('/', async (req, res) => {
  try {
    const { 
      employeeId,
      status,
      startDate,
      endDate,
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.attendanceDate = {};
      if (startDate) where.attendanceDate.gte = new Date(startDate as string);
      if (endDate) where.attendanceDate.lte = new Date(endDate as string);
    }

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
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
        orderBy: { attendanceDate: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    res.json({
      data: records,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get attendance by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await prisma.attendance.findUnique({
      where: { id: req.params.id },
      include: {
        employee: true,
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
});

// Create attendance record
router.post('/', async (req, res) => {
  try {
    const record = await prisma.attendance.create({
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
    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

// Update attendance record
router.put('/:id', async (req, res) => {
  try {
    const record = await prisma.attendance.update({
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
    res.json(record);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    await prisma.attendance.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

// Get attendance statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate as string);
    if (endDate) dateFilter.lte = new Date(endDate as string);

    const where = Object.keys(dateFilter).length > 0 ? { attendanceDate: dateFilter } : {};

    const [
      totalRecords,
      recordsByStatus,
      lateCount,
      earlyDepartureCount,
      todayAttendance,
    ] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      prisma.attendance.count({ where: { ...where, isLate: true } }),
      prisma.attendance.count({ where: { ...where, isEarlyDeparture: true } }),
      prisma.attendance.count({
        where: { 
          attendanceDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    res.json({
      totalRecords,
      recordsByStatus,
      lateCount,
      earlyDepartureCount,
      todayAttendance,
    });
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({ error: 'Failed to fetch attendance statistics' });
  }
});

// Clock in
router.post('/clock-in', async (req, res) => {
  try {
    const { employeeId, clockInMethod, clockInLocation } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already clocked in today
    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId,
        attendanceDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existing?.clockInAt) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }

    const record = await prisma.attendance.upsert({
      where: { id: existing?.id || '' },
      create: {
        employeeId,
        attendanceDate: new Date(),
        clockInAt: new Date(),
        clockInMethod,
        clockInLocation,
        status: 'PRESENT',
      },
      update: {
        clockInAt: new Date(),
        clockInMethod,
        clockInLocation,
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            fullName: true,
          },
        },
      },
    });

    res.json(record);
  } catch (error) {
    console.error('Error clocking in:', error);
    res.status(500).json({ error: 'Failed to clock in' });
  }
});

// Clock out
router.post('/clock-out', async (req, res) => {
  try {
    const { employeeId, clockOutMethod, clockOutLocation } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const record = await prisma.attendance.findFirst({
      where: {
        employeeId,
        attendanceDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!record || !record.clockInAt) {
      return res.status(400).json({ error: 'Not clocked in today' });
    }

    if (record.clockOutAt) {
      return res.status(400).json({ error: 'Already clocked out today' });
    }

    const clockOutAt = new Date();
    const workedMs = clockOutAt.getTime() - new Date(record.clockInAt).getTime();
    const workedHours = Math.round((workedMs / (1000 * 60 * 60)) * 100) / 100;

    const updated = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        clockOutAt,
        clockOutMethod,
        clockOutLocation,
        workedHours,
      },
      include: {
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            firstName: true,
            lastName: true,
            fullName: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error clocking out:', error);
    res.status(500).json({ error: 'Failed to clock out' });
  }
});

export default router;
