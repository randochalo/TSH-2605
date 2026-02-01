import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import assetRoutes from './routes/assets';
import maintenanceRoutes from './routes/maintenance';
import repairRoutes from './routes/repairs';
import requisitionRoutes from './routes/requisitions';
import vendorRoutes from './routes/vendors';
import quotationRoutes from './routes/quotations';
import orderRoutes from './routes/orders';
import employeeRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leave';
import payrollRoutes from './routes/payroll';
import claimsRoutes from './routes/claims';
import performanceRoutes from './routes/performance';
import trainingRoutes from './routes/training';
import recruitmentRoutes from './routes/recruitment';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/assets', assetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Dashboard data endpoint (legacy - kept for compatibility)
app.get('/api/dashboard', async (req, res) => {
  try {
    const { prisma } = await import('@repo/database');
    
    const [
      totalAssets,
      activeAssets,
      maintenanceAssets,
      pendingRepairs,
      totalEmployees,
      activeEmployees,
      pendingPRs,
      totalVendors,
      openPOs,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'ACTIVE' } }),
      prisma.asset.count({ where: { status: 'MAINTENANCE' } }),
      prisma.repairOrder.count({ where: { status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      prisma.employee.count(),
      prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
      prisma.purchaseRequisition.count({ where: { status: { in: ['DRAFT', 'PENDING_APPROVAL'] } } }),
      prisma.vendor.count(),
      prisma.purchaseOrder.count({ where: { status: { in: ['APPROVED', 'SENT_TO_VENDOR', 'PARTIALLY_RECEIVED'] } } }),
    ]);

    res.json({
      ems: {
        totalAssets,
        activeAssets,
        maintenanceAssets,
        pendingRepairs,
      },
      hrms: {
        totalEmployees,
        activeEmployees,
      },
      ps: {
        pendingPRs,
        totalVendors,
        openPOs,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});