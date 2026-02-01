# TSH-2605 Demo Script

## Overview
A 15-20 minute guided demo of the Enterprise Management System covering EMS, PS, and HRMS modules.

---

## Demo Setup (2 minutes)

### Starting the Demo
```bash
cd /home/sarah/clawd/prototype/TSH-2605
# Start the development server
npm run dev
```

### Access Points
- Web App: http://localhost:3000
- API: http://localhost:3001

---

## Demo Flow (15-18 minutes)

### 1. Dashboard Overview (2 minutes)

**URL:** `http://localhost:3000`

**Talking Points:**
- Welcome to the TSH-2605 Enterprise Management System
- Single dashboard view across all modules
- Quick access to key metrics and recent activity
- Notifications and alerts center

**Demo Actions:**
1. Show the main dashboard with KPI cards
2. Highlight recent activity feed
3. Show quick action buttons
4. Demonstrate notification bell with pending items

**Key Metrics to Show:**
- Total Assets: 1,247
- Active PRs: 28
- Total Employees: 342
- Pending Tasks: 15

---

### 2. Equipment Management System (EMS) (5 minutes)

#### 2.1 EMS Dashboard
**URL:** `http://localhost:3000/ems`

**Demo Actions:**
1. Navigate to EMS module from sidebar
2. Show KPI cards: Total Assets, Due for Maintenance, Active Repairs, Warranty Expiring
3. Click through to Assets list

#### 2.2 Asset Management
**URL:** `http://localhost:3000/ems/assets`

**Demo Actions:**
1. Show asset data table with filtering
2. Use search bar to find "Dell Laptop"
3. Click on asset row to view detail page
4. Show asset information, depreciation chart, warranty status

**Talking Points:**
- Complete asset lifecycle tracking
- Status management: Active, Maintenance, Repair, Retired
- Warranty tracking with automatic alerts
- Depreciation calculations

#### 2.3 Maintenance & Repairs
**URL:** `http://localhost:3000/ems/maintenance`

**Demo Actions:**
1. Show maintenance schedule calendar view
2. Highlight overdue items
3. Navigate to Repairs page
4. Show repair history and costs

---

### 3. Procurement System (PS) (5 minutes)

#### 3.1 PS Dashboard
**URL:** `http://localhost:3000/ps`

**Demo Actions:**
1. Navigate to PS module
2. Show KPI cards: Pending PRs, Active POs, Approved Vendors, YTD Spend
3. Show spend by category breakdown

#### 3.2 Purchase Requisitions
**URL:** `http://localhost:3000/ps/requisitions`

**Demo Actions:**
1. Show PR list with status filters
2. Click "New Requisition" to show form
3. Fill out sample PR for IT equipment
4. Show approval workflow status

**Talking Points:**
- Multi-level approval workflows
- Budget integration
- Email notifications

#### 3.3 Vendors & Quotations
**URL:** `http://localhost:3000/ps/vendors`

**Demo Actions:**
1. Show vendor directory with ratings
2. Navigate to Quotations page
3. Show RFQ comparison view
4. Highlight best price selection

#### 3.4 Purchase Orders & 3-Way Matching
**URL:** `http://localhost:3000/ps/orders`

**Demo Actions:**
1. Show active POs with delivery tracking
2. Navigate to Goods Receipts
3. Show 3-way matching page
4. Explain PO → GR → Invoice matching process

---

### 4. HR Management System (HRMS) (5 minutes)

#### 4.1 HRMS Dashboard
**URL:** `http://localhost:3000/hrms`

**Demo Actions:**
1. Navigate to HRMS module
2. Show employee statistics
3. Show department distribution
4. Highlight pending approvals

#### 4.2 Employee Database
**URL:** `http://localhost:3000/hrms/employees`

**Demo Actions:**
1. Show employee list with search
2. Filter by department
3. Click "Add Employee" to show form
4. Show sample employee profile

#### 4.3 Attendance & Leave
**URL:** `http://localhost:3000/hrms/attendance`

**Demo Actions:**
1. Show today's attendance snapshot
2. Navigate to Leave Management
3. Show leave balance and requests
4. Demonstrate leave approval workflow

#### 4.4 Payroll & Claims
**URL:** `http://localhost:3000/hrms/payroll`

**Demo Actions:**
1. Show payroll summary for current month
2. Navigate to Claims page
3. Show expense claim submission
4. Show approval status

---

### 5. Summary & Q&A (2 minutes)

**Key Features Summary:**
- ✅ 3 integrated modules: EMS, PS, HRMS
- ✅ 37 database tables supporting all features
- ✅ Complete asset lifecycle management
- ✅ Full procurement workflow (PR → PO → GR → Payment)
- ✅ HR self-service portal
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time notifications and alerts

**Architecture Highlights:**
- Next.js 16 frontend
- Express.js API backend
- Prisma ORM with PostgreSQL
- Monorepo structure with Turborepo

**Next Steps:**
- API integration with frontend
- Authentication & authorization
- Advanced reporting & analytics
- Mobile app development

---

## Demo Tips

1. **Browser Setup:** Use Chrome/Edge at 100% zoom
2. **Screen Resolution:** 1920x1080 or higher recommended
3. **Data:** Demo data is pre-populated for realistic presentation
4. **Backup:** Keep `npm run dev` running in background

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 busy | Kill existing process or change port |
| Build errors | Run `npm install` first |
| Blank page | Check browser console for errors |
| API errors | Ensure API server is running on port 3001 |

---

## Post-Demo Checklist

- [ ] All modules demonstrated
- [ ] Questions answered
- [ ] Feedback collected
- [ ] Next meeting scheduled
- [ ] Action items documented
