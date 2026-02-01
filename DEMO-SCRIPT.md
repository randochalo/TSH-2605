# TSH-2605 Demo Script - Enhanced Edition

## Overview
A 20-minute guided demo of the Enterprise Management System covering EMS, PS, and HRMS modules with all new UI/UX enhancements.

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

### Demo Mode Features
- Demo badge visible at top of screen
- Sample data indicators on relevant items
- Keyboard shortcuts available (Ctrl+? for help)
- Watermark for demo authenticity

---

## Demo Flow (18 minutes)

### 1. Dashboard Overview (3 minutes)

**URL:** `http://localhost:3000`

**Talking Points:**
- Welcome to the TSH-2605 Enterprise Management System
- Single dashboard view across all modules
- Real-time statistics with animated counters
- Interactive charts showing trends
- Quick action buttons for common tasks

**Demo Actions:**
1. Show the main dashboard with animated stat cards
2. Highlight the spending chart (mouse over for tooltips)
3. Show asset category distribution (donut chart)
4. Point out employee trend line chart
5. Hover over quick action buttons to show scale effect
6. Show recent activity feed with animated entries
7. Demonstrate refresh button with loading state

**Key Metrics to Show:**
- Total Assets: Animated counter
- Active PRs: Real-time count
- Total Employees: With new hires indicator
- Pending Tasks: Consolidated view

**Visual Features:**
- 🎨 Smooth page transitions
- 📊 Interactive charts with Recharts
- ✨ Staggered card animations
- 🎯 Hover effects on all cards

---

### 2. Equipment Management System (EMS) (6 minutes)

#### 2.1 EMS Dashboard
**URL:** `http://localhost:3000/ems`

**Demo Actions:**
1. Navigate to EMS module from sidebar
2. Show KPI cards with hover effects
3. Click through to Assets list

#### 2.2 Asset Management
**URL:** `http://localhost:3000/ems/assets`

**Demo Actions:**
1. Show asset data table with skeleton loading
2. Use search bar with debounced filtering
3. Apply status filter (show dropdown animation)
4. Click on QR code icon to display asset QR code
5. Download QR code as PNG
6. Click on asset row to navigate to detail page

**Enhanced Features to Highlight:**
- ✅ QR Code generation for every asset
- ✅ Status badges with color coding (Active=green, Maintenance=yellow, Repair=red)
- ✅ Condition badges (Excellent, Good, Fair, Poor, Critical)
- ✅ Responsive table with horizontal scroll on mobile
- ✅ Empty state when no results found
- ✅ Error state with retry button

**Talking Points:**
- "Each asset has a unique QR code for quick identification"
- "Scan the QR code with any phone to access asset details"
- "Status and condition are clearly visible at a glance"
- "The table adapts beautifully to mobile screens"

#### 2.3 Asset Detail Page
**URL:** `http://localhost:3000/ems/assets/[id]`

**Demo Actions:**
1. Show asset information card
2. Display depreciation schedule with chart
3. Show warranty status with visual indicator
4. View maintenance history
5. Display QR code prominently

**Features to Show:**
- Depreciation calculation (straight-line method)
- Monthly depreciation breakdown
- Book value progression
- Warranty countdown

#### 2.4 Maintenance & Repairs
**URL:** `http://localhost:3000/ems/maintenance`

**Demo Actions:**
1. Show maintenance schedule calendar view
2. Highlight overdue items with warning badges
3. Navigate to Repairs page
4. Show repair cost charts
5. Display spare parts low stock alerts

---

### 3. Procurement System (PS) (5 minutes)

#### 3.1 PS Dashboard
**URL:** `http://localhost:3000/ps`

**Demo Actions:**
1. Navigate to PS module
2. Show KPI cards with trend indicators
3. Show spend by category breakdown (chart)

#### 3.2 Purchase Requisitions
**URL:** `http://localhost:3000/ps/requisitions`

**Demo Actions:**
1. Show PR list with status filters
2. Click "New Requisition" to show animated modal
3. Fill out sample PR for IT equipment
4. Show approval workflow status with badges

**Badges to Highlight:**
- Draft (gray)
- Pending (yellow)
- Approved (green)
- Rejected (red)

#### 3.3 Vendors & Quotations
**URL:** `http://localhost:3000/ps/vendors`

**Demo Actions:**
1. Show vendor directory with ratings
2. Display vendor performance scorecard
3. Navigate to Quotations page
4. Show RFQ comparison view with chart
5. Highlight best price selection

#### 3.4 Purchase Orders & PDF Generation
**URL:** `http://localhost:3000/ps/orders`

**Demo Actions:**
1. Show active POs with status badges
2. Click "Export PDF" button
3. Show generated PDF with company branding
4. Navigate to Goods Receipts

#### 3.5 Three-Way Matching
**URL:** `http://localhost:3000/ps/matching`

**Demo Actions:**
1. Show matching interface
2. Explain PO → GRN → Invoice flow
3. Show color-coded matching status:
   - 🟢 Green: Matched within tolerance
   - 🟡 Yellow: Partial match
   - 🔴 Red: Unmatched
4. Show variance calculations
5. Approve/Reject actions

---

### 4. HR Management System (HRMS) (5 minutes)

#### 4.1 HRMS Dashboard
**URL:** `http://localhost:3000/hrms`

**Demo Actions:**
1. Navigate to HRMS module
2. Show employee statistics with animated counters
3. Show department distribution (pie chart)
4. Highlight pending approvals

#### 4.2 Employee Database
**URL:** `http://localhost:3000/hrms/employees`

**Demo Actions:**
1. Show employee list with search
2. Filter by department
3. Click "Add Employee" to show animated modal
4. Show sample employee profile

**Visual Features:**
- Staggered list animations
- Status badges (Active, On Leave, Terminated)
- Department color coding

#### 4.3 Attendance & Leave
**URL:** `http://localhost:3000/hrms/attendance`

**Demo Actions:**
1. Show attendance calendar heatmap
2. Display today's attendance snapshot
3. Navigate to Leave Management
4. Show leave balance with visual indicators
5. Demonstrate leave approval workflow

#### 4.4 Payroll & PDF Generation
**URL:** `http://localhost:3000/hrms/payroll`

**Demo Actions:**
1. Show payroll summary for current month
2. Explain Malaysian statutory calculations:
   - EPF: Employee 11%, Employer 12%/13%
   - SOCSO: Employee 0.5%, Employer 1.75%
   - EIS: Employee 0.2%, Employer 0.2%
   - PCB: Monthly tax deduction
3. Show payslip preview
4. Click "Export PDF" to generate payslip
5. Open PDF to show professional formatting

**Formula Display:**
```
Net Pay = Gross Pay - EPF - SOCSO - EIS - PCB
```

#### 4.5 Claims
**URL:** `http://localhost:3000/hrms/claims`

**Demo Actions:**
1. Show expense claim submission form
2. Show approval status with badges
3. Display claim history

---

### 5. Reports Module (2 minutes)

#### 5.1 Reports Dashboard
**URL:** `http://localhost:3000/reports`

**Demo Actions:**
1. Show reports hub with all modules
2. Click through to EMS reports
3. Show asset utilization report with chart
4. Export report to CSV
5. Show HRMS payroll summary

**Available Reports:**
- EMS: Asset register, Depreciation, Maintenance, Repairs, Warranty
- PS: PO Summary, Vendor Performance, Spend Analysis, 3-Way Matching
- HRMS: Payroll Summary, Statutory Contributions, Attendance, Leave

---

### 6. Mobile Responsiveness (1 minute)

**Demo Actions:**
1. Resize browser to mobile width (375px)
2. Show hamburger menu animation
3. Navigate through mobile menu
4. Show responsive tables
5. Show touch-friendly buttons

**Features to Highlight:**
- Collapsible sidebar
- Mobile-optimized tables
- Touch targets (44px minimum)
- Bottom action bar
- Swipe-friendly interactions

---

### 7. Demo Mode Features (1 minute)

**Demo Actions:**
1. Point out demo badge at top
2. Show sample data indicators
3. Press Ctrl+? to show keyboard shortcuts
4. Demonstrate a keyboard shortcut (Ctrl+R for refresh)

**Keyboard Shortcuts:**
- Ctrl+K: Quick search
- Ctrl+N: Create new item
- Ctrl+R: Refresh data
- Ctrl+?: Show shortcuts
- Esc: Close modal

---

## Summary & Q&A (2 minutes)

### Key Features Summary
- ✅ 3 integrated modules: EMS, PS, HRMS
- ✅ 37 database tables supporting all features
- ✅ Complete asset lifecycle with QR codes
- ✅ Full procurement workflow with 3-way matching
- ✅ Malaysian-compliant payroll with PDF payslips
- ✅ Interactive charts and analytics
- ✅ Mobile-responsive design
- ✅ Smooth animations throughout
- ✅ Professional UI/UX polish

### Architecture Highlights
- Next.js 16 frontend with App Router
- Express.js API backend
- Prisma ORM with PostgreSQL
- Monorepo structure with Turborepo
- Framer Motion for animations
- Recharts for data visualization
- jsPDF for PDF generation

### Excellence Indicators
- 🎨 99% UI/UX completion
- 📱 Full mobile responsiveness
- ✨ Smooth animations
- 🛡️ Comprehensive error handling
- 📊 Rich reporting with charts
- 🔒 Form validation throughout
- ♿ Accessibility features

---

## Demo Tips

1. **Browser Setup:** Use Chrome/Edge at 100% zoom
2. **Screen Resolution:** 1920x1080 or higher recommended
3. **Mobile Demo:** Use responsive mode at 375px width
4. **Data:** Demo data is pre-populated (3,500+ records)
5. **Backup:** Keep `npm run dev` running in background

### Animation Timing
- Allow animations to complete before clicking
- Hover effects add polish - use them
- Page transitions take ~300ms
- Toast notifications auto-dismiss in 5s

### Common Questions

**Q: Is the QR code functional?**
A: Yes, each asset has a unique QR code that links to its detail page.

**Q: Can we export data?**
A: Yes, CSV export available on all reports and tables. PDF export for payslips and POs.

**Q: Does it work on mobile?**
A: Fully responsive - all features accessible on mobile devices.

**Q: What about security?**
A: Authentication protected routes, role-based access control ready.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 busy | Kill existing process or change port |
| Build errors | Run `npm install` first |
| Blank page | Check browser console for errors |
| API errors | Ensure API server is running on port 3001 |
| Slow animations | Check browser performance settings |

---

## Post-Demo Checklist

- [ ] All modules demonstrated
- [ ] Animations shown
- [ ] Mobile view demonstrated
- [ ] PDF generation shown
- [ ] QR codes displayed
- [ ] Charts interacted with
- [ ] Questions answered
- [ ] Feedback collected
- [ ] Next meeting scheduled
- [ ] Action items documented

---

## Version History

- **v0.99.0** - Current: Final polish, 99% completion
- **v0.92.0** - Previous: Part 2 complete with business logic
- **v0.85.0** - Initial: Core features implemented

---

**Demo Script Version:** 2.0  
**Last Updated:** 2025-02-01  
**Status:** Production Ready
