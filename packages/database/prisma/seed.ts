import { PrismaClient, UserRole, UserStatus, AssetStatus, AssetCondition, DepreciationMethod, ScheduleType, MaintenancePriority, WorkOrderStatus, RepairStatus, WarrantyType, ClaimStatus, AbcClass, TransactionType, PRStatus, VendorStatus, QuotationStatus, POStatus, InspectionResult, InvoiceStatus, MatchingStatus, BudgetStatus, Gender, MaritalStatus, EmploymentType, EmployeeStatus, PayFrequency, DocumentType, ClockMethod, AttendanceStatus, LeaveType, LeaveStatus, PayrollStatus, ClaimType, ClaimStatus as ClaimStatusEnum, ReviewType, ReviewStatus, GoalStatus, EnrollmentStatus, RequisitionStatus, CandidateStatus, InterviewType, InterviewStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  await clearDatabase();

  // Create Branches
  const branches = await createBranches();
  console.log(`✅ Created ${branches.length} branches`);

  // Create Users
  const users = await createUsers();
  console.log(`✅ Created ${users.length} users`);

  // Create EMS Data
  const emsData = await createEMSData(branches);
  console.log(`✅ Created EMS data: ${emsData.assets.length} assets, ${emsData.categories.length} categories`);

  // Create PS Data
  const psData = await createPSData(branches);
  console.log(`✅ Created PS data: ${psData.vendors.length} vendors, ${psData.prs.length} PRs, ${psData.pos.length} POs`);

  // Create HRMS Data
  const hrmsData = await createHRMSData(branches);
  console.log(`✅ Created HRMS data: ${hrmsData.employees.length} employees, ${hrmsData.payrollPeriods.length} payroll periods`);

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Branches: ${branches.length}`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Assets: ${emsData.assets.length}`);
  console.log(`   - Maintenance Records: ${emsData.maintenanceRecords.length}`);
  console.log(`   - Repair Orders: ${emsData.repairOrders.length}`);
  console.log(`   - Depreciation Entries: Created for all assets`);
  console.log(`   - Vendors: ${psData.vendors.length}`);
  console.log(`   - Purchase Requisitions: ${psData.prs.length}`);
  console.log(`   - Purchase Orders: ${psData.pos.length}`);
  console.log(`   - Invoices (with 3-way matching): ${psData.invoices?.length || 0}`);
  console.log(`   - Employees: ${hrmsData.employees.length}`);
  console.log(`   - Payroll Periods: ${hrmsData.payrollPeriods.length}`);
  console.log(`   - Payroll Entries: ${hrmsData.employees.length * hrmsData.payrollPeriods.length}`);
  console.log(`   - Leave Requests: ${hrmsData.leaveRequests.length}`);
  console.log(`   - Claims: ${hrmsData.claims.length}`);
  console.log(`   - Attendance Records: 320+`);
  console.log(`\n📈 Total Records: ${branches.length + users.length + emsData.assets.length + emsData.maintenanceRecords.length + emsData.repairOrders.length + psData.vendors.length + psData.prs.length + psData.pos.length + (psData.invoices?.length || 0) + hrmsData.employees.length + hrmsData.payrollPeriods.length + hrmsData.leaveRequests.length + hrmsData.claims.length + 320}+`);
}

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.auditLog.deleteMany();
  
  // HRMS
  await prisma.interview.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.recruitmentRequisition.deleteMany();
  await prisma.trainingEnrollment.deleteMany();
  await prisma.trainingCourse.deleteMany();
  await prisma.performanceGoal.deleteMany();
  await prisma.performanceReview.deleteMany();
  await prisma.claimApproval.deleteMany();
  await prisma.claimLine.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.payrollEntry.deleteMany();
  await prisma.payrollPeriod.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employeeDocument.deleteMany();
  await prisma.employee.deleteMany();
  
  // PS
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.gRNLine.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  await prisma.pOLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.quotationLine.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.vendorEvaluation.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.budgetAllocation.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.pRApproval.deleteMany();
  await prisma.pRLine.deleteMany();
  await prisma.purchaseRequisition.deleteMany();
  
  // EMS
  await prisma.warrantyClaim.deleteMany();
  await prisma.warranty.deleteMany();
  await prisma.repairPart.deleteMany();
  await prisma.repairOrder.deleteMany();
  await prisma.sparePartTransaction.deleteMany();
  await prisma.sparePartInventory.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.depreciationEntry.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.maintenanceSchedule.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.assetCategory.deleteMany();
  await prisma.assetLocation.deleteMany();
  
  // Shared
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
}

async function createBranches() {
  const branchData = [
    { code: 'HQ', name: 'Headquarters', city: 'Kuala Lumpur', state: 'Kuala Lumpur' },
    { code: 'GLD', name: 'Global Logistics Department', city: 'Kuala Lumpur', state: 'Kuala Lumpur' },
    { code: 'PK', name: 'Port Klang Branch', city: 'Port Klang', state: 'Selangor' },
    { code: 'PGD', name: 'Pasir Gudang Branch', city: 'Pasir Gudang', state: 'Johor' },
    { code: 'BTW', name: 'Butterworth Branch', city: 'Butterworth', state: 'Penang' },
    { code: 'PB', name: 'Padang Besar Branch', city: 'Padang Besar', state: 'Perlis' },
  ];

  return await Promise.all(
    branchData.map(b => prisma.branch.create({ data: b }))
  );
}

async function createUsers() {
  const password = await hash('password123', 10);
  
  const userData = [
    { email: 'admin@mmf.com', firstName: 'System', lastName: 'Administrator', role: UserRole.SUPER_ADMIN },
    { email: 'fleet.mgr@mmf.com', firstName: 'Ahmad', lastName: 'Ismail', role: UserRole.MANAGER },
    { email: 'procurement.mgr@mmf.com', firstName: 'Sarah', lastName: 'Tan', role: UserRole.MANAGER },
    { email: 'hr.mgr@mmf.com', firstName: 'Rajesh', lastName: 'Kumar', role: UserRole.MANAGER },
    { email: 'finance.mgr@mmf.com', firstName: 'Lim', lastName: 'Wei Ming', role: UserRole.MANAGER },
    { email: 'tech1@mmf.com', firstName: 'Kumar', lastName: 'Sundaram', role: UserRole.USER },
    { email: 'tech2@mmf.com', firstName: 'Ahmad', lastName: 'Razak', role: UserRole.USER },
    { email: 'buyer@mmf.com', firstName: 'Tan', lastName: 'Mei Ling', role: UserRole.USER },
    { email: 'hr.officer@mmf.com', firstName: 'Siti', lastName: 'Aminah', role: UserRole.USER },
    { email: 'ops.mgr@mmf.com', firstName: 'John', lastName: 'Smith', role: UserRole.MANAGER },
  ];

  return await Promise.all(
    userData.map((u, i) => 
      prisma.user.create({
        data: {
          ...u,
          id: `user-${i + 1}`,
          password,
          status: UserStatus.ACTIVE,
        }
      })
    )
  );
}

async function createEMSData(branches: any[]) {
  // Asset Categories
  const categories = await Promise.all([
    prisma.assetCategory.create({ data: { code: 'PM', name: 'Prime Movers', expectedLife: 120 } }),
    prisma.assetCategory.create({ data: { code: 'TRL', name: 'Trailers', expectedLife: 96 } }),
    prisma.assetCategory.create({ data: { code: 'FLT', name: 'Forklifts', expectedLife: 84 } }),
    prisma.assetCategory.create({ data: { code: 'CRN', name: 'Cranes', expectedLife: 144 } }),
    prisma.assetCategory.create({ data: { code: 'CHE', name: 'Container Handling', expectedLife: 120 } }),
    prisma.assetCategory.create({ data: { code: 'VEH', name: 'Vehicles', expectedLife: 72 } }),
    prisma.assetCategory.create({ data: { code: 'EQP', name: 'Equipment', expectedLife: 60 } }),
  ]);

  // Asset Locations
  const locations = await Promise.all([
    prisma.assetLocation.create({ data: { code: 'YARD-A', name: 'Main Yard A' } }),
    prisma.assetLocation.create({ data: { code: 'YARD-B', name: 'Main Yard B' }),
    prisma.assetLocation.create({ data: { code: 'WS-01', name: 'Workshop Bay 1' } }),
    prisma.assetLocation.create({ data: { code: 'WS-02', name: 'Workshop Bay 2' } }),
    prisma.assetLocation.create({ data: { code: 'WAREHOUSE', name: 'Main Warehouse' } }),
    prisma.assetLocation.create({ data: { code: 'OFFICE', name: 'Office Building' } }),
  ]);

  // Create 50+ Assets
  const assetPrefixes = ['PM', 'TRL', 'FLT', 'CRN', 'CHE', 'VEH'];
  const assetNames = [
    'Hino 700 Series Prime Mover',
    'Volvo FH16 Prime Mover',
    'Scania R450 Prime Mover',
    'Mercedes Actros Prime Mover',
    '40ft Flatbed Trailer',
    '40ft Container Trailer',
    '20ft Container Trailer',
    'Low Loader Trailer',
    'Toyota 3-Ton Forklift',
    'Caterpillar 5-Ton Forklift',
    'Konecranes Reach Stacker',
    'Kalmar Empty Handler',
    'Grove Mobile Crane 50T',
    'XCMG Truck Crane 25T',
    'Toyota Hilux Pickup',
    'Nissan Navara Pickup',
    'Ford Ranger Pickup',
    'Mitsubishi Lorry 3T',
    'Isuzu Lorry 5T',
    'Hino Lorry 10T',
  ];

  const assets: any[] = [];
  for (let i = 1; i <= 55; i++) {
    const categoryIndex = i % categories.length;
    const branchIndex = i % branches.length;
    const locationIndex = i % locations.length;
    
    const asset = await prisma.asset.create({
      data: {
        assetNumber: `${assetPrefixes[categoryIndex]}-${String(i).padStart(4, '0')}`,
        name: assetNames[i % assetNames.length],
        description: `${assetNames[i % assetNames.length]} - Unit ${i}`,
        categoryId: categories[categoryIndex].id,
        locationId: locations[locationIndex].id,
        branchId: branches[branchIndex].id,
        status: i % 10 === 0 ? AssetStatus.MAINTENANCE : AssetStatus.ACTIVE,
        condition: [AssetCondition.EXCELLENT, AssetCondition.GOOD, AssetCondition.FAIR, AssetCondition.GOOD][i % 4],
        acquisitionDate: new Date(2020 + (i % 5), (i % 12), 1),
        acquisitionCost: 100000 + (i * 10000),
        currentValue: 80000 + (i * 5000),
        serialNumber: `SN${Date.now()}${i}`,
        manufacturer: ['Hino', 'Volvo', 'Toyota', 'Caterpillar', 'Konecranes'][i % 5],
        model: `Model-${2020 + (i % 5)}`,
        yearOfManufacture: 2020 + (i % 5),
        usefulLifeYears: 10,
        depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
      }
    });
    assets.push(asset);
  }

  // Maintenance Schedules
  const schedules: any[] = [];
  for (const asset of assets.slice(0, 20)) {
    const schedule = await prisma.maintenanceSchedule.create({
      data: {
        assetId: asset.id,
        title: `Preventive Maintenance - ${asset.name}`,
        description: 'Regular preventive maintenance schedule',
        scheduleType: ScheduleType.TIME_BASED,
        frequencyMonths: 3,
        nextDueAt: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)),
        priority: MaintenancePriority.MEDIUM,
        checklistItems: JSON.stringify([
          { item: 'Check engine oil level', type: 'visual' },
          { item: 'Check tire pressure', type: 'measurement' },
          { item: 'Inspect brake pads', type: 'visual' },
          { item: 'Check battery terminals', type: 'visual' },
        ]),
      }
    });
    schedules.push(schedule);
  }

  // Maintenance Records
  const maintenanceRecords: any[] = [];
  for (let i = 0; i < 30; i++) {
    const asset = assets[i % assets.length];
    const record = await prisma.maintenanceRecord.create({
      data: {
        assetId: asset.id,
        workOrderNumber: `WO-${String(i + 1).padStart(5, '0')}`,
        title: `Scheduled Maintenance ${i + 1}`,
        description: 'Routine maintenance completed',
        status: WorkOrderStatus.COMPLETED,
        priority: MaintenancePriority.MEDIUM,
        scheduledStartAt: new Date(2024, (i % 12), 1),
        actualStartAt: new Date(2024, (i % 12), 1),
        actualEndAt: new Date(2024, (i % 12), 2),
        laborHours: 4 + (i % 4),
        laborCost: 200 + (i * 10),
        partsCost: 500 + (i * 20),
        totalCost: 700 + (i * 30),
      }
    });
    maintenanceRecords.push(record);
  }

  // Repair Orders
  const repairOrders: any[] = [];
  for (let i = 0; i < 25; i++) {
    const asset = assets[i % assets.length];
    const repair = await prisma.repairOrder.create({
      data: {
        orderNumber: `RO-${String(i + 1).padStart(5, '0')}`,
        assetId: asset.id,
        title: `Repair ${i + 1} - ${asset.name}`,
        description: `Repair work for ${asset.name}`,
        symptom: ['Engine overheating', 'Brake failure', 'Hydraulic leak', 'Electrical fault'][i % 4],
        diagnosis: 'Component failure identified',
        resolution: 'Replaced faulty component',
        status: i % 3 === 0 ? RepairStatus.OPEN : RepairStatus.CLOSED,
        priority: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT][i % 4],
        reportedBy: 'tech1@mmf.com',
        reportedAt: new Date(2024, (i % 12), 5),
        completedAt: i % 3 !== 0 ? new Date(2024, (i % 12), 7) : null,
        laborHours: 2 + (i % 6),
        laborCost: 100 + (i * 15),
        partsCost: 300 + (i * 25),
        totalCost: 400 + (i * 40),
      }
    });
    repairOrders.push(repair);
  }

  // Spare Parts
  const spareParts = await Promise.all([
    prisma.sparePart.create({ data: { partNumber: 'OIL-FILTER-001', name: 'Engine Oil Filter', category: 'Filters', reorderPoint: 20, reorderQuantity: 100, standardCost: 25.50 } }),
    prisma.sparePart.create({ data: { partNumber: 'AIR-FILTER-001', name: 'Air Filter', category: 'Filters', reorderPoint: 15, reorderQuantity: 80, standardCost: 45.00 } }),
    prisma.sparePart.create({ data: { partNumber: 'BRAKE-PAD-001', name: 'Brake Pad Set', category: 'Brakes', reorderPoint: 10, reorderQuantity: 50, standardCost: 120.00 } }),
    prisma.sparePart.create({ data: { partNumber: 'TIRE-295-80', name: 'Tire 295/80R22.5', category: 'Tires', reorderPoint: 8, reorderQuantity: 40, standardCost: 850.00 } }),
    prisma.sparePart.create({ data: { partNumber: 'BATTERY-12V', name: '12V Battery', category: 'Electrical', reorderPoint: 5, reorderQuantity: 20, standardCost: 350.00 } }),
    prisma.sparePart.create({ data: { partNumber: 'BELT-SERP-001', name: 'Serpentine Belt', category: 'Engine', reorderPoint: 10, reorderQuantity: 30, standardCost: 85.00 } }),
    prisma.sparePart.create({ data: { partNumber: 'HOSE-HYD-001', name: 'Hydraulic Hose', category: 'Hydraulics', reorderPoint: 12, reorderQuantity: 40, standardCost: 65.00 } }),
    prisma.sparePart.create({ data: { partNumber: 'LIGHT-LED-001', name: 'LED Headlight', category: 'Electrical', reorderPoint: 6, reorderQuantity: 24, standardCost: 150.00 } }),
  ]);

  // Warranties
  for (let i = 0; i < 15; i++) {
    const asset = assets[i];
    await prisma.warranty.create({
      data: {
        assetId: asset.id,
        warrantyNumber: `WR-${String(i + 1).padStart(5, '0')}`,
        warrantyType: WarrantyType.MANUFACTURER,
        provider: ['Hino Malaysia', 'Volvo Trucks', 'Toyota Malaysia', 'CAT Parts'][i % 4],
        startDate: new Date(2020 + (i % 5), 0, 1),
        endDate: new Date(2025 + (i % 5), 11, 31),
        terms: 'Standard manufacturer warranty',
        coverage: 'Parts and labor for defects',
      }
    });
  }

  // Depreciation Entries for each asset
  for (const asset of assets) {
    const acquisitionDate = new Date(asset.acquisitionDate);
    const now = new Date();
    const salvageValue = Number(asset.acquisitionCost) * 0.1; // 10% salvage
    const depreciableAmount = Number(asset.acquisitionCost) - salvageValue;
    const monthlyDepreciation = depreciableAmount / (asset.usefulLifeYears * 12);
    
    let accumulatedDepreciation = 0;
    let currentMonth = new Date(acquisitionDate);
    currentMonth.setMonth(currentMonth.getMonth() + 1); // Start from next month
    
    while (currentMonth <= now && accumulatedDepreciation < depreciableAmount) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const depreciationAmount = Math.min(monthlyDepreciation, depreciableAmount - accumulatedDepreciation);
      accumulatedDepreciation += depreciationAmount;
      const bookValue = Number(asset.acquisitionCost) - accumulatedDepreciation;
      
      await prisma.depreciationEntry.create({
        data: {
          assetId: asset.id,
          periodYear: year,
          periodMonth: month,
          method: asset.depreciationMethod,
          openingValue: bookValue + depreciationAmount,
          depreciationAmount,
          accumulatedDepreciation,
          closingValue: bookValue,
          postedToGl: true,
        }
      });
      
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
  }

  return { assets, categories, locations, maintenanceRecords, repairOrders, spareParts, schedules };
}

async function createPSData(branches: any[]) {
  // Vendors
  const vendors = await Promise.all([
    prisma.vendor.create({ data: { vendorCode: 'V001', companyName: 'Hino Motors Malaysia Sdn Bhd', category: 'Vehicles', status: VendorStatus.ACTIVE, paymentTerms: 'Net 30', creditLimit: 500000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V002', companyName: 'Volvo Trucks Malaysia', category: 'Vehicles', status: VendorStatus.ACTIVE, paymentTerms: 'Net 45', creditLimit: 1000000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V003', companyName: 'Toyota Material Handling', category: 'Equipment', status: VendorStatus.ACTIVE, paymentTerms: 'Net 30', creditLimit: 300000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V004', companyName: 'Caterpillar Malaysia', category: 'Equipment', status: VendorStatus.ACTIVE, paymentTerms: 'Net 30', creditLimit: 400000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V005', companyName: 'Konecranes Malaysia', category: 'Equipment', status: VendorStatus.ACTIVE, paymentTerms: 'Net 60', creditLimit: 600000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V006', companyName: 'Petronas Dagangan Berhad', category: 'Fuel', status: VendorStatus.ACTIVE, paymentTerms: 'Net 15', creditLimit: 200000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V007', companyName: 'Shell Malaysia Trading', category: 'Fuel', status: VendorStatus.ACTIVE, paymentTerms: 'Net 15', creditLimit: 200000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V008', companyName: 'Continental Tire Malaysia', category: 'Parts', status: VendorStatus.ACTIVE, paymentTerms: 'Net 30', creditLimit: 150000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V009', companyName: 'Bosch Malaysia', category: 'Parts', status: VendorStatus.ACTIVE, paymentTerms: 'Net 30', creditLimit: 180000 } }),
    prisma.vendor.create({ data: { vendorCode: 'V010', companyName: 'Allied Auto Parts', category: 'Parts', status: VendorStatus.ACTIVE, paymentTerms: 'Net 30', creditLimit: 100000 } }),
  ]);

  // Budgets
  const budgets = await Promise.all([
    prisma.budget.create({ data: { budgetNumber: 'BUD-2024-001', name: 'Fleet Expansion 2024', fiscalYear: 2024, department: 'Operations', totalBudget: 5000000, committedAmount: 2500000, spentAmount: 1800000, availableAmount: 3200000, status: BudgetStatus.ACTIVE, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') } }),
    prisma.budget.create({ data: { budgetNumber: 'BUD-2024-002', name: 'Maintenance Parts 2024', fiscalYear: 2024, department: 'Maintenance', totalBudget: 800000, committedAmount: 400000, spentAmount: 250000, availableAmount: 550000, status: BudgetStatus.ACTIVE, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') } }),
    prisma.budget.create({ data: { budgetNumber: 'BUD-2024-003', name: 'IT Equipment 2024', fiscalYear: 2024, department: 'IT', totalBudget: 300000, committedAmount: 100000, spentAmount: 50000, availableAmount: 250000, status: BudgetStatus.ACTIVE, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') } }),
    prisma.budget.create({ data: { budgetNumber: 'BUD-2024-004', name: 'Office Supplies 2024', fiscalYear: 2024, department: 'Admin', totalBudget: 50000, committedAmount: 20000, spentAmount: 10000, availableAmount: 40000, status: BudgetStatus.ACTIVE, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') } }),
  ]);

  // Purchase Requisitions (30+)
  const prs: any[] = [];
  const prStatuses = [PRStatus.APPROVED, PRStatus.APPROVED, PRStatus.APPROVED, PRStatus.PENDING_APPROVAL, PRStatus.FULLY_ORDERED];
  
  for (let i = 1; i <= 35; i++) {
    const status = prStatuses[i % prStatuses.length];
    const pr = await prisma.purchaseRequisition.create({
      data: {
        prNumber: `PR-${String(i).padStart(5, '0')}`,
        title: `Purchase Requisition ${i} - ${['Vehicle Parts', 'Office Equipment', 'Safety Equipment', 'IT Hardware', 'Maintenance Supplies'][i % 5]}`,
        description: 'Procurement request for operations',
        requestorId: `user-${(i % 9) + 1}`,
        requestorName: ['Ahmad', 'Sarah', 'Rajesh', 'Lim', 'Kumar'][i % 5],
        department: ['Operations', 'Maintenance', 'IT', 'Admin', 'HR'][i % 5],
        branchId: branches[i % branches.length].id,
        priority: [Priority.LOW, Priority.MEDIUM, Priority.HIGH][i % 3],
        status,
        totalAmount: 10000 + (i * 5000),
        submittedAt: status !== PRStatus.DRAFT ? new Date(2024, (i % 12), 1) : null,
        approvedAt: status === PRStatus.APPROVED || status === PRStatus.FULLY_ORDERED ? new Date(2024, (i % 12), 3) : null,
      }
    });
    prs.push(pr);

    // PR Lines
    await prisma.pRLine.create({
      data: {
        prId: pr.id,
        lineNumber: 1,
        itemDescription: ['Engine parts', 'Tires', 'Computer equipment', 'Safety gear', 'Office furniture'][i % 5],
        quantity: 10 + (i % 20),
        unitOfMeasure: ['pcs', 'sets', 'units'][i % 3],
        estimatedUnitPrice: 500 + (i * 50),
        estimatedTotal: (500 + (i * 50)) * (10 + (i % 20)),
      }
    });

    // PR Approvals for approved PRs
    if (status === PRStatus.APPROVED || status === PRStatus.FULLY_ORDERED) {
      await prisma.pRApproval.create({
        data: {
          prId: pr.id,
          approverLevel: 1,
          approverId: 'user-4',
          approverName: 'Lim Wei Ming',
          action: ApprovalAction.APPROVED,
          actionAt: new Date(2024, (i % 12), 3),
          comments: 'Approved as per budget',
        }
      });
    }
  }

  // Quotations
  for (let i = 1; i <= 20; i++) {
    await prisma.quotation.create({
      data: {
        quotationNumber: `QT-${String(i).padStart(5, '0')}`,
        vendorId: vendors[i % vendors.length].id,
        vendorName: vendors[i % vendors.length].companyName,
        quotationDate: new Date(2024, (i % 12), 5),
        validUntil: new Date(2024, (i % 12) + 1, 5),
        subtotal: 15000 + (i * 2000),
        taxAmount: (15000 + (i * 2000)) * 0.06,
        totalAmount: (15000 + (i * 2000)) * 1.06,
        status: QuotationStatus.RECEIVED,
        leadTimeDays: 14 + (i % 14),
      }
    });
  }

  // Purchase Orders
  const pos: any[] = [];
  const poStatuses = [POStatus.FULLY_RECEIVED, POStatus.PARTIALLY_RECEIVED, POStatus.SENT_TO_VENDOR, POStatus.APPROVED];
  
  for (let i = 1; i <= 25; i++) {
    const vendor = vendors[i % vendors.length];
    const pr = prs[i % prs.length];
    const status = poStatuses[i % poStatuses.length];
    
    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${String(i).padStart(5, '0')}`,
        prId: pr.id,
        vendorId: vendor.id,
        vendorName: vendor.companyName,
        orderDate: new Date(2024, (i % 12), 10),
        deliveryDate: new Date(2024, (i % 12), 24),
        subtotal: 20000 + (i * 3000),
        taxAmount: (20000 + (i * 3000)) * 0.06,
        totalAmount: (20000 + (i * 3000)) * 1.06,
        status,
        approvedAt: new Date(2024, (i % 12), 11),
      }
    });
    pos.push(po);

    // PO Lines
    await prisma.pOLine.create({
      data: {
        poId: po.id,
        lineNumber: 1,
        description: ['Engine parts', 'Tires', 'Computer equipment', 'Safety gear'][i % 4],
        quantity: 20 + (i % 30),
        quantityReceived: status === POStatus.FULLY_RECEIVED ? 20 + (i % 30) : status === POStatus.PARTIALLY_RECEIVED ? (20 + (i % 30)) / 2 : 0,
        unitOfMeasure: 'pcs',
        unitPrice: 800 + (i * 100),
        totalPrice: (800 + (i * 100)) * (20 + (i % 30)),
      }
    });

    // Goods Receipts for received POs
    if (status === POStatus.FULLY_RECEIVED || status === POStatus.PARTIALLY_RECEIVED) {
      await prisma.goodsReceipt.create({
        data: {
          grnNumber: `GRN-${String(i).padStart(5, '0')}`,
          poId: po.id,
          vendorId: vendor.id,
          receiptDate: new Date(2024, (i % 12), 20),
          deliveryNoteNumber: `DN-${i}`,
          receivedBy: 'warehouse@mmf.com',
          inspectionResult: InspectionResult.PASSED,
        }
      });
    }
  }

  // Invoices with 3-Way Matching data
  const invoices: any[] = [];
  const matchingStatuses = [MatchingStatus.FULLY_MATCHED, MatchingStatus.FULLY_MATCHED, MatchingStatus.PARTIAL_MATCH, MatchingStatus.UNMATCHED, MatchingStatus.MATCHED_WITH_VARIANCE];
  
  for (let i = 1; i <= 30; i++) {
    const po = pos[i % pos.length];
    const grn = await prisma.goodsReceipt.findFirst({ where: { poId: po.id } });
    const matchingStatus = matchingStatuses[i % matchingStatuses.length];
    
    // Calculate variance based on matching status
    let invoiceSubtotal = po.subtotal;
    let variance = 0;
    let variancePercent = 0;
    
    if (matchingStatus === MatchingStatus.PARTIAL_MATCH) {
      invoiceSubtotal = po.subtotal * 0.7; // 30% variance
      variance = po.subtotal - invoiceSubtotal;
      variancePercent = 30;
    } else if (matchingStatus === MatchingStatus.MATCHED_WITH_VARIANCE) {
      invoiceSubtotal = po.subtotal * 0.98; // 2% variance (within tolerance)
      variance = po.subtotal - invoiceSubtotal;
      variancePercent = 2;
    } else if (matchingStatus === MatchingStatus.UNMATCHED) {
      invoiceSubtotal = po.subtotal * 1.15; // 15% variance (outside tolerance)
      variance = po.subtotal - invoiceSubtotal;
      variancePercent = 15;
    }
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${String(i).padStart(5, '0')}`,
        poId: po.id,
        vendorId: po.vendorId,
        grnId: grn?.id,
        invoiceDate: new Date(2024, (i % 12), 25),
        dueDate: new Date(2024, (i % 12) + 1, 25),
        subtotal: invoiceSubtotal,
        taxAmount: invoiceSubtotal * 0.06,
        totalAmount: invoiceSubtotal * 1.06,
        balanceDue: i % 3 === 0 ? 0 : invoiceSubtotal * 1.06,
        status: i % 3 === 0 ? InvoiceStatus.PAID : InvoiceStatus.PENDING,
        matchingStatus,
        poAmount: po.totalAmount,
        grnAmount: grn ? po.totalAmount : null,
        variance,
        variancePercent,
        tolerancePercent: 5,
      }
    });
    invoices.push(invoice);

    // Create Invoice Lines
    await prisma.invoiceLine.create({
      data: {
        invoiceId: invoice.id,
        lineNumber: 1,
        description: `Invoice line for ${po.poNumber}`,
        quantity: 20 + (i % 30),
        unitOfMeasure: 'pcs',
        unitPrice: invoiceSubtotal / (20 + (i % 30)),
        totalPrice: invoiceSubtotal,
      }
    });
  }

  // Create Three-Way Matching Records (can be stored as audit/matching log if needed)
  // For now, the Invoice model with matchingStatus serves this purpose

  return { vendors, budgets, prs, pos, invoices };
}

async function createHRMSData(branches: any[]) {
  // Create 150+ Employees
  const firstNames = ['Ahmad', 'Mohammad', 'Nurul', 'Siti', 'Abdul', 'Muhammad', 'Aminah', 'Fatimah', 'Ismail', 'Ibrahim', 'Kumar', 'Rajesh', 'Tan', 'Lim', 'Wong', 'Chan', 'Lee', 'Goh', 'Ng', 'Chong', 'Siva', 'Ravi', 'Muthu', 'Wei', 'Hui', 'Ming', 'Ying', 'John', 'David', 'Michael', 'Sarah', 'Emma', 'Jessica', 'Sakura', 'Yuki', 'Mei', 'Hassan', 'Razak', 'Osman', 'Farid', 'Zulkifli', 'Azman', 'Fauzi', 'Hamzah', 'Imran', 'Johan', 'Kamal', 'Luqman', 'Musa', 'Nasir'];
  const lastNames = ['Abdullah', 'Ahmad', 'Ali', 'Hassan', 'Hussein', 'Ismail', 'Ibrahim', 'Rahman', 'Tan', 'Lee', 'Lim', 'Wong', 'Chan', 'Ng', 'Chong', 'Goh', 'Koh', 'Kumar', 'Singh', 'Nair', 'Rao', 'Menon', 'Raj', 'Prem', 'Siva', 'Subramaniam', 'Chen', 'Wang', 'Liu', 'Zhang', 'Kim', 'Park', 'Suzuki', 'Tanaka', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];
  const departments = ['Operations', 'Maintenance', 'Procurement', 'HR', 'Finance', 'IT', 'Admin', 'Sales', 'Warehouse', 'Safety', 'Engineering', 'Quality', 'Logistics'];
  const positions = ['Manager', 'Supervisor', 'Officer', 'Executive', 'Technician', 'Operator', 'Clerk', 'Coordinator', 'Specialist', 'Assistant', 'Engineer', 'Analyst', 'Consultant', 'Director', 'VP'];

  const employees: any[] = [];
  for (let i = 1; i <= 155; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const dept = departments[i % departments.length];
    const pos = positions[i % positions.length];
    
    const employee = await prisma.employee.create({
      data: {
        employeeNumber: `EMP-${String(i).padStart(4, '0')}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@mmf.com`,
        phone: `+60 12-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        icNumber: `${Math.floor(Math.random() * 99)}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 31) + 1).padStart(2, '0')}-10-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        dateOfBirth: new Date(1970 + (i % 35), (i % 12), (i % 28) + 1),
        gender: i % 3 === 0 ? Gender.FEMALE : Gender.MALE,
        nationality: 'Malaysian',
        department: dept,
        position: `${dept} ${pos}`,
        branchId: branches[i % branches.length].id,
        employmentType: i % 10 === 0 ? EmploymentType.CONTRACT : EmploymentType.FULL_TIME,
        employmentStatus: EmployeeStatus.ACTIVE,
        dateJoined: new Date(2015 + (i % 9), (i % 12), 1),
        basicSalary: 3000 + (i * 150),
        currency: 'MYR',
        payFrequency: PayFrequency.MONTHLY,
        address: `${i} Jalan ${['Maju', 'Usaha', 'Damai', 'Sentosa', 'Bahagia'][i % 5]}`,
        city: ['Kuala Lumpur', 'Port Klang', 'Pasir Gudang', 'Butterworth', 'Padang Besar'][i % 5],
        state: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perlis'][i % 5],
        postalCode: String(Math.floor(Math.random() * 90000) + 10000),
        emergencyContactName: `${firstNames[(i + 5) % firstNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
        emergencyContactPhone: `+60 13-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        emergencyContactRelation: ['Spouse', 'Parent', 'Sibling', 'Friend'][i % 4],
      }
    });
    employees.push(employee);
  }

  // Payroll Periods
  const payrollPeriods: any[] = [];
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === 2025 && month > 1) break;
      
      const period = await prisma.payrollPeriod.create({
        data: {
          name: `${year}-${String(month).padStart(2, '0')} Payroll`,
          year,
          month,
          startDate: new Date(year, month - 1, 1),
          endDate: new Date(year, month, 0),
          paymentDate: new Date(year, month, 5),
          status: PayrollStatus.CLOSED,
          totalEmployees: employees.length,
          totalGrossPay: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 1.2,
          totalDeductions: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 0.15,
          totalNetPay: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 1.05,
          totalEpfEmployee: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 0.11,
          totalEpfEmployer: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 0.13,
          totalSocso: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 0.005,
          totalEis: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 0.002,
          totalPcb: employees.reduce((sum, e) => sum + Number(e.basicSalary), 0) * 0.08,
        }
      });
      payrollPeriods.push(period);

      // Payroll Entries for each employee
      for (const emp of employees) {
        const basicSalary = Number(emp.basicSalary);
        const epfEmployee = basicSalary * 0.11;
        const socso = basicSalary * 0.005;
        const eis = basicSalary * 0.002;
        const pcb = basicSalary * 0.08;
        const totalDeductions = epfEmployee + socso + eis + pcb;
        
        await prisma.payrollEntry.create({
          data: {
            periodId: period.id,
            employeeId: emp.id,
            basicSalary,
            overtimePay: basicSalary * 0.1,
            allowances: basicSalary * 0.15,
            bonuses: month === 12 ? basicSalary : 0,
            grossPay: basicSalary * 1.25 + (month === 12 ? basicSalary : 0),
            epfEmployee,
            socsoEmployee: socso,
            eisEmployee: eis,
            pcb,
            totalDeductions,
            netPay: (basicSalary * 1.25 + (month === 12 ? basicSalary : 0)) - totalDeductions,
            epfEmployer: basicSalary * 0.13,
            socsoEmployer: socso,
            eisEmployer: eis,
            payslipGenerated: true,
          }
        });
      }
    }
  }

  // Leave Requests - 80+ records
  const leaveRequests: any[] = [];
  for (let i = 0; i < 80; i++) {
    const emp = employees[i % employees.length];
    const leaveType = [LeaveType.ANNUAL, LeaveType.MEDICAL, LeaveType.UNPAID, LeaveType.EMERGENCY][i % 4];
    const startDate = new Date(2024, (i % 12), 10 + (i % 10));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (i % 5) + 1);
    
    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: emp.id,
        leaveType,
        startDate,
        endDate,
        numberOfDays: i % 5 + 1,
        reason: ['Family matters', 'Medical checkup', 'Personal', 'Vacation'][i % 4],
        status: [LeaveStatus.APPROVED, LeaveStatus.APPROVED, LeaveStatus.PENDING, LeaveStatus.TAKEN][i % 4],
        submittedAt: new Date(2024, (i % 12), 1),
        approvedAt: i % 4 !== 2 ? new Date(2024, (i % 12), 3) : null,
      }
    });
    leaveRequests.push(leave);
  }

  // Leave Balances
  for (const emp of employees) {
    await prisma.leaveBalance.create({
      data: {
        employeeId: emp.id,
        leaveType: LeaveType.ANNUAL,
        year: 2024,
        entitlement: 14,
        carriedForward: 0,
        taken: Math.floor(Math.random() * 10),
        pending: Math.floor(Math.random() * 3),
        available: 14 - Math.floor(Math.random() * 10) - Math.floor(Math.random() * 3),
      }
    });
    await prisma.leaveBalance.create({
      data: {
        employeeId: emp.id,
        leaveType: LeaveType.MEDICAL,
        year: 2024,
        entitlement: 14,
        carriedForward: 0,
        taken: Math.floor(Math.random() * 5),
        pending: 0,
        available: 14 - Math.floor(Math.random() * 5),
      }
    });
  }

  // Claims - 60+ records
  const claims: any[] = [];
  for (let i = 0; i < 60; i++) {
    const emp = employees[i % employees.length];
    const claimType = [ClaimTypeEnum.MEDICAL, ClaimTypeEnum.TRAVEL, ClaimTypeEnum.MEAL, ClaimTypeEnum.TRANSPORT][i % 4];
    
    const claim = await prisma.claim.create({
      data: {
        employeeId: emp.id,
        claimNumber: `CLM-${String(i + 1).padStart(5, '0')}`,
        claimType,
        claimDate: new Date(2024, (i % 12), 15),
        description: `${claimType} claim for ${['medical checkup', 'business trip', 'client meeting', 'office supplies'][i % 4]}`,
        totalAmount: 50 + (i * 25),
        receiptCount: Math.floor(Math.random() * 3) + 1,
        status: [ClaimStatusEnum.APPROVED, ClaimStatusEnum.PAID, ClaimStatusEnum.PENDING_APPROVAL][i % 3],
        submittedAt: new Date(2024, (i % 12), 16),
        approvedAt: i % 3 !== 2 ? new Date(2024, (i % 12), 18) : null,
        paidAt: i % 3 === 1 ? new Date(2024, (i % 12), 20) : null,
      }
    });
    claims.push(claim);

    // Claim Lines
    await prisma.claimLine.create({
      data: {
        claimId: claim.id,
        lineNumber: 1,
        expenseDate: new Date(2024, (i % 12), 15),
        category: claimType,
        description: 'Expense item',
        amount: 50 + (i * 25),
        gstAmount: (50 + (i * 25)) * 0.06,
      }
    });
  }

  // Attendance Records - 300+ records
  for (let i = 0; i < 320; i++) {
    const emp = employees[i % employees.length];
    const date = new Date(2024, Math.floor(i / 20) % 12, (i % 28) + 1);
    
    await prisma.attendance.create({
      data: {
        employeeId: emp.id,
        attendanceDate: date,
        clockInAt: new Date(date.getTime() + 8 * 60 * 60 * 1000 + 30 * 60 * 1000), // 8:30 AM
        clockOutAt: new Date(date.getTime() + 17 * 60 * 60 * 1000 + 30 * 60 * 1000), // 5:30 PM
        clockInMethod: ClockMethod.WEB,
        clockOutMethod: ClockMethod.WEB,
        scheduledHours: 8,
        workedHours: 8,
        breakHours: 1,
        overtimeHours: i % 10 === 0 ? 2 : 0,
        status: AttendanceStatus.PRESENT,
      }
    });
  }

  // Performance Reviews
  for (let i = 0; i < 30; i++) {
    const emp = employees[i % employees.length];
    await prisma.performanceReview.create({
      data: {
        employeeId: emp.id,
        reviewPeriod: '2024-12',
        reviewType: ReviewType.ANNUAL,
        overallRating: 3 + (i % 3),
        performanceScore: 70 + (i % 30),
        competencyScore: 70 + (i % 25),
        achievements: 'Met all KPI targets',
        areasForImprovement: 'Communication skills',
        goalsForNextPeriod: 'Complete leadership training',
        status: ReviewStatus.COMPLETED,
        reviewedBy: 'hr.mgr@mmf.com',
        reviewDate: new Date(2024, 11, 15),
      }
    });
  }

  // Training Courses
  const courses = await Promise.all([
    prisma.trainingCourse.create({ data: { courseCode: 'TRG-001', title: 'Forklift Operation Safety', category: 'Safety', provider: 'OSHA Academy', durationHours: 16, costPerPerson: 500 } }),
    prisma.trainingCourse.create({ data: { courseCode: 'TRG-002', title: 'Leadership Development', category: 'Management', provider: 'Mind Resources', durationHours: 24, costPerPerson: 1200 } }),
    prisma.trainingCourse.create({ data: { courseCode: 'TRG-003', title: 'Excel Advanced', category: 'IT Skills', provider: 'New Horizons', durationHours: 12, costPerPerson: 350 } }),
    prisma.trainingCourse.create({ data: { courseCode: 'TRG-004', title: 'First Aid Certification', category: 'Safety', provider: 'Red Crescent', durationHours: 8, costPerPerson: 200 } }),
    prisma.trainingCourse.create({ data: { courseCode: 'TRG-005', title: 'Customer Service Excellence', category: 'Soft Skills', provider: 'PSMB', durationHours: 16, costPerPerson: 450 } }),
  ]);

  // Training Enrollments
  for (let i = 0; i < 40; i++) {
    await prisma.trainingEnrollment.create({
      data: {
        courseId: courses[i % courses.length].id,
        employeeId: employees[i % employees.length].id,
        enrollmentDate: new Date(2024, (i % 12), 1),
        status: [EnrollmentStatus.COMPLETED, EnrollmentStatus.ENROLLED, EnrollmentStatus.PENDING][i % 3],
        score: 70 + (i % 30),
        result: i % 3 === 0 ? 'Pass' : null,
        cost: courses[i % courses.length].costPerPerson,
      }
    });
  }

  // Recruitment Requisitions
  for (let i = 0; i < 10; i++) {
    await prisma.recruitmentRequisition.create({
      data: {
        requisitionNumber: `REQ-${String(i + 1).padStart(5, '0')}`,
        position: ['Operations Manager', 'Technician', 'HR Executive', 'Finance Officer', 'Sales Coordinator'][i % 5],
        department: departments[i % departments.length],
        employmentType: EmploymentType.FULL_TIME,
        numberOfPositions: 1 + (i % 2),
        justification: 'Business expansion',
        requirements: 'Relevant experience required',
        status: [RequisitionStatus.APPROVED, RequisitionStatus.IN_PROGRESS, RequisitionStatus.CLOSED][i % 3],
        requestedBy: 'ops.mgr@mmf.com',
        approvedAt: i % 3 !== 0 ? new Date(2024, (i % 12), 5) : null,
      }
    });
  }

  // Candidates
  for (let i = 0; i < 25; i++) {
    await prisma.candidate.create({
      data: {
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        email: `candidate${i}@email.com`,
        phone: `+60 14-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        source: ['LinkedIn', 'JobStreet', 'Referral', 'Direct'][i % 4],
        currentEmployer: ['ABC Sdn Bhd', 'XYZ Logistics', 'Global Freight', 'Transport Co'][i % 4],
        currentPosition: positions[i % positions.length],
        yearsOfExperience: 2 + (i % 15),
        status: [CandidateStatus.NEW, CandidateStatus.INTERVIEW, CandidateStatus.HIRED, CandidateStatus.REJECTED][i % 4],
        appliedAt: new Date(2024, (i % 12), 1),
      }
    });
  }

  return { employees, payrollPeriods, leaveRequests, claims, courses };
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });