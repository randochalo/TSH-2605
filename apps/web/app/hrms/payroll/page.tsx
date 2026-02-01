"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../../../components/DataTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { FormModal } from "../../../components/FormModal";

interface PayrollPeriod {
  id: string;
  name: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  paymentDate: string;
  status: string;
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEpfEmployer: number;
  totalEpfEmployee: number;
  totalSocso: number;
  totalEis: number;
  totalPcb: number;
}

interface PayrollEntry {
  id: string;
  employee: {
    employeeNumber: string;
    fullName: string;
    department: string;
  };
  basicSalary: number;
  overtimePay: number;
  allowances: number;
  bonuses: number;
  grossPay: number;
  epfEmployee: number;
  socsoEmployee: number;
  eisEmployee: number;
  pcb: number;
  totalDeductions: number;
  netPay: number;
  epfEmployer: number;
  socsoEmployer: number;
  eisEmployer: number;
}

interface PayslipData {
  entry: PayrollEntry;
  period: PayrollPeriod;
}

// Malaysian Payroll Calculation Constants
const EPF_RATES = {
  employee: 0.11, // 11% employee contribution
  employer: 0.13, // 13% employer contribution (for salaries > RM5000)
  employerLow: 0.12, // 12% for salaries <= RM5000
};

const SOCSO_RATES = {
  // Category 1: Employees under 60 years old
  employee: 0.005, // 0.5% employee (rounded to nearest 5 cents)
  employer: 0.0175, // 1.75% employer
};

const EIS_RATES = {
  employee: 0.002, // 0.2% employee
  employer: 0.002, // 0.2% employer
};

// PCB Calculation (Simplified - based on Malaysia LHDN tables)
function calculatePCB(grossPay: number): number {
  // Simplified PCB calculation for demo purposes
  // In production, this would use the full LHDN PCB tables
  const annualIncome = grossPay * 12;
  
  if (annualIncome <= 5000) return 0;
  if (annualIncome <= 20000) return grossPay * 0.01;
  if (annualIncome <= 35000) return grossPay * 0.03;
  if (annualIncome <= 50000) return grossPay * 0.06;
  if (annualIncome <= 70000) return grossPay * 0.08;
  if (annualIncome <= 100000) return grossPay * 0.10;
  if (annualIncome <= 250000) return grossPay * 0.15;
  if (annualIncome <= 400000) return grossPay * 0.18;
  if (annualIncome <= 600000) return grossPay * 0.20;
  if (annualIncome <= 1000000) return grossPay * 0.22;
  return grossPay * 0.24;
}

// Calculate EPF contribution
function calculateEPF(basicSalary: number): { employee: number; employer: number } {
  const employee = Math.round(basicSalary * EPF_RATES.employee);
  const employerRate = basicSalary > 5000 ? EPF_RATES.employer : EPF_RATES.employerLow;
  const employer = Math.round(basicSalary * employerRate);
  return { employee, employer };
}

// Calculate SOCSO contribution
function calculateSOCSO(basicSalary: number): { employee: number; employer: number } {
  const employee = Math.ceil((basicSalary * SOCSO_RATES.employee) / 0.05) * 0.05;
  const employer = Math.round(basicSalary * SOCSO_RATES.employer);
  return { employee, employer };
}

// Calculate EIS contribution
function calculateEIS(basicSalary: number): { employee: number; employer: number } {
  const employee = Math.round(basicSalary * EIS_RATES.employee);
  const employer = Math.round(basicSalary * EIS_RATES.employer);
  return { employee, employer };
}

// Calculate complete payroll
function calculatePayroll(
  basicSalary: number,
  overtimePay: number = 0,
  allowances: number = 0,
  bonuses: number = 0
): {
  grossPay: number;
  epfEmployee: number;
  epfEmployer: number;
  socsoEmployee: number;
  socsoEmployer: number;
  eisEmployee: number;
  eisEmployer: number;
  pcb: number;
  totalDeductions: number;
  netPay: number;
} {
  const grossPay = basicSalary + overtimePay + allowances + bonuses;
  
  const epf = calculateEPF(basicSalary);
  const socso = calculateSOCSO(basicSalary);
  const eis = calculateEIS(basicSalary);
  const pcb = calculatePCB(grossPay);
  
  const totalDeductions = epf.employee + socso.employee + eis.employee + pcb;
  const netPay = grossPay - totalDeductions;
  
  return {
    grossPay,
    epfEmployee: epf.employee,
    epfEmployer: epf.employer,
    socsoEmployee: socso.employee,
    socsoEmployer: socso.employer,
    eisEmployee: eis.employee,
    eisEmployer: eis.employer,
    pcb,
    totalDeductions,
    netPay,
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(value);
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  POSTED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-purple-100 text-purple-800",
};

export default function PayrollPage() {
  const { data: periods, loading: periodsLoading } = useApi<PayrollPeriod[]>("/api/payroll/periods");
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [entries, setEntries] = useState<PayrollEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [processingEmployee, setProcessingEmployee] = useState<any>(null);

  // Load entries when period is selected
  useEffect(() => {
    if (selectedPeriod) {
      loadEntries(selectedPeriod.id);
    }
  }, [selectedPeriod]);

  const loadEntries = async (periodId: string) => {
    setEntriesLoading(true);
    try {
      const response = await fetch(`/api/payroll/entries?periodId=${periodId}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.data || data);
      }
    } catch (error) {
      console.error("Error loading payroll entries:", error);
    } finally {
      setEntriesLoading(false);
    }
  };

  const handleProcessPayroll = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    const basicSalary = parseFloat(data.basicSalary as string) || 0;
    const overtimePay = parseFloat(data.overtimePay as string) || 0;
    const allowances = parseFloat(data.allowances as string) || 0;
    const bonuses = parseFloat(data.bonuses as string) || 0;

    const calculation = calculatePayroll(basicSalary, overtimePay, allowances, bonuses);

    // Submit to API
    try {
      const response = await fetch("/api/payroll/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodId: selectedPeriod?.id,
          employeeId: processingEmployee?.id,
          ...data,
          ...calculation,
        }),
      });

      if (response.ok) {
        setProcessModalOpen(false);
        if (selectedPeriod) {
          loadEntries(selectedPeriod.id);
        }
      }
    } catch (error) {
      console.error("Error processing payroll:", error);
    }
  };

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (item: PayrollEntry) => (
        <div>
          <p className="font-medium">{item.employee?.fullName}</p>
          <p className="text-sm text-gray-500">{item.employee?.employeeNumber}</p>
        </div>
      ),
    },
    { key: "employee.department", header: "Department", render: (item: PayrollEntry) => item.employee?.department },
    {
      key: "basicSalary",
      header: "Basic Salary",
      render: (item: PayrollEntry) => formatCurrency(item.basicSalary),
    },
    {
      key: "grossPay",
      header: "Gross Pay",
      render: (item: PayrollEntry) => formatCurrency(item.grossPay),
    },
    {
      key: "deductions",
      header: "Deductions",
      render: (item: PayrollEntry) => (
        <div className="text-sm">
          <p>EPF: {formatCurrency(item.epfEmployee)}</p>
          <p>SOCSO: {formatCurrency(item.socsoEmployee)}</p>
          <p>EIS: {formatCurrency(item.eisEmployee)}</p>
          <p>PCB: {formatCurrency(item.pcb)}</p>
        </div>
      ),
    },
    {
      key: "netPay",
      header: "Net Pay",
      render: (item: PayrollEntry) => (
        <span className="font-bold text-green-600">{formatCurrency(item.netPay)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: PayrollEntry) => (
        <button
          onClick={() => {
            setSelectedEntry(item);
            setPayslipModalOpen(true);
          }}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Payslip
        </button>
      ),
    },
  ];

  const currentPeriod = periods?.[0];
  const totalGross = entries.reduce((sum, e) => sum + e.grossPay, 0);
  const totalNet = entries.reduce((sum, e) => sum + e.netPay, 0);
  const totalEPF = entries.reduce((sum, e) => sum + e.epfEmployee + e.epfEmployer, 0);
  const totalSOCSO = entries.reduce((sum, e) => sum + e.socsoEmployee + e.socsoEmployer, 0);
  const totalEIS = entries.reduce((sum, e) => sum + e.eisEmployee + e.eisEmployer, 0);
  const totalPCB = entries.reduce((sum, e) => sum + e.pcb, 0);

  if (periodsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll Processing</h1>
          <p className="text-gray-500">Manage monthly payroll with Malaysian statutory calculations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📥 Export
          </button>
          <button
            onClick={() => setProcessModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Process Payroll
          </button>
        </div>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Payroll Period</p>
          <p className="text-xl font-bold">
            {currentPeriod ? `${currentPeriod.name}` : "No Period"}
          </p>
          <p className="text-xs text-gray-500">
            {currentPeriod && `${new Date(currentPeriod.startDate).toLocaleDateString()} - ${new Date(currentPeriod.endDate).toLocaleDateString()}`}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Gross Pay</p>
          <p className="text-2xl font-bold">{formatCurrency(totalGross)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Deductions</p>
          <p className="text-2xl font-bold">{formatCurrency(totalGross - totalNet)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Net Pay</p>
          <p className="text-2xl font-bold">{formatCurrency(totalNet)}</p>
        </div>
      </div>

      {/* Statutory Contributions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-600">EPF (Employee + Employer)</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(totalEPF)}</p>
          <p className="text-xs text-gray-500">11% Employee + 12-13% Employer</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-600">SOCSO (Employee + Employer)</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalSOCSO)}</p>
          <p className="text-xs text-gray-500">0.5% Employee + 1.75% Employer</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-600">EIS (Employee + Employer)</p>
          <p className="text-xl font-bold text-orange-600">{formatCurrency(totalEIS)}</p>
          <p className="text-xs text-gray-500">0.2% Employee + 0.2% Employer</p>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-600">PCB (Income Tax)</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalPCB)}</p>
          <p className="text-xs text-gray-500">Monthly Tax Deduction</p>
        </div>
      </div>

      {/* Period Selection */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const period = periods?.find((p) => p.id === e.target.value);
              setSelectedPeriod(period || null);
            }}
            value={selectedPeriod?.id || ""}
          >
            <option value="">Select Payroll Period...</option>
            {periods?.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} ({period.status})
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-500">
          {entries.length} employees processed
        </span>
      </div>

      {/* Payroll Entries Table */}
      {entriesLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : entries.length > 0 ? (
        <DataTable columns={columns} data={entries} />
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          <p className="text-lg mb-2">📊 No payroll entries found</p>
          <p className="text-sm">Select a payroll period or process new payroll</p>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedEntry && (
        <FormModal
          isOpen={payslipModalOpen}
          onClose={() => setPayslipModalOpen(false)}
          title={`Payslip - ${selectedEntry.employee.fullName}`}
          onSubmit={() => {}}
          hideSubmit={true}
        >
          <div className="space-y-6">
            {/* Company Header */}
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-bold">Malaysian Maritime Facilities Sdn Bhd</h3>
              <p className="text-sm text-gray-600">Payslip for {currentPeriod?.name}</p>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Employee ID</p>
                <p className="font-medium">{selectedEntry.employee.employeeNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Department</p>
                <p className="font-medium">{selectedEntry.employee.department}</p>
              </div>
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{selectedEntry.employee.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Date</p>
                <p className="font-medium">
                  {currentPeriod && new Date(currentPeriod.paymentDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Earnings */}
            <div>
              <h4 className="font-semibold mb-2 border-b pb-1">Earnings</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span>{formatCurrency(selectedEntry.basicSalary)}</span>
                </div>
                {selectedEntry.overtimePay > 0 && (
                  <div className="flex justify-between">
                    <span>Overtime Pay</span>
                    <span>{formatCurrency(selectedEntry.overtimePay)}</span>
                  </div>
                )}
                {selectedEntry.allowances > 0 && (
                  <div className="flex justify-between">
                    <span>Allowances</span>
                    <span>{formatCurrency(selectedEntry.allowances)}</span>
                  </div>
                )}
                {selectedEntry.bonuses > 0 && (
                  <div className="flex justify-between">
                    <span>Bonuses</span>
                    <span>{formatCurrency(selectedEntry.bonuses)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Gross Pay</span>
                  <span>{formatCurrency(selectedEntry.grossPay)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="font-semibold mb-2 border-b pb-1">Deductions</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>EPF (Employee 11%)</span>
                  <span>{formatCurrency(selectedEntry.epfEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO (Employee 0.5%)</span>
                  <span>{formatCurrency(selectedEntry.socsoEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS (Employee 0.2%)</span>
                  <span>{formatCurrency(selectedEntry.eisEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PCB (Income Tax)</span>
                  <span>{formatCurrency(selectedEntry.pcb)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1 text-red-600">
                  <span>Total Deductions</span>
                  <span>{formatCurrency(selectedEntry.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Employer Contributions */}
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-semibold mb-2 text-sm">Employer Contributions</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>EPF Employer ({selectedEntry.basicSalary > 5000 ? "13%" : "12%"})</span>
                  <span>{formatCurrency(selectedEntry.epfEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO Employer (1.75%)</span>
                  <span>{formatCurrency(selectedEntry.socsoEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS Employer (0.2%)</span>
                  <span>{formatCurrency(selectedEntry.eisEmployer)}</span>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Net Pay</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(selectedEntry.netPay)}
              </p>
            </div>

            {/* Calculation Formula */}
            <div className="text-xs text-gray-500 border-t pt-4">
              <p className="font-medium mb-1">Calculation:</p>
              <p>Net Pay = Gross Pay - EPF - SOCSO - EIS - PCB</p>
              <p>{formatCurrency(selectedEntry.grossPay)} - {formatCurrency(selectedEntry.epfEmployee)} - {formatCurrency(selectedEntry.socsoEmployee)} - {formatCurrency(selectedEntry.eisEmployee)} - {formatCurrency(selectedEntry.pcb)}</p>
            </div>
          </div>
        </FormModal>
      )}

      {/* Process Payroll Modal */}
      <FormModal
        isOpen={processModalOpen}
        onClose={() => setProcessModalOpen(false)}
        title="Process Employee Payroll"
        onSubmit={handleProcessPayroll}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select name="employeeId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select Employee...</option>
              {/* This would be populated from employee API */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Basic Salary (RM)</label>
            <input
              name="basicSalary"
              type="number"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="5000.00"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Overtime Pay (RM)</label>
              <input
                name="overtimePay"
                type="number"
                step="0.01"
                defaultValue="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Allowances (RM)</label>
              <input
                name="allowances"
                type="number"
                step="0.01"
                defaultValue="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bonuses (RM)</label>
            <input
              name="bonuses"
              type="number"
              step="0.01"
              defaultValue="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded text-sm">
            <p className="font-medium text-yellow-800">Automatic Calculations:</p>
            <ul className="text-yellow-700 mt-1 space-y-1">
              <li>• EPF Employee: 11% of basic salary</li>
              <li>• EPF Employer: 12% (≤RM5K) or 13% (&gt;RM5K)</li>
              <li>• SOCSO: 0.5% employee + 1.75% employer</li>
              <li>• EIS: 0.2% employee + 0.2% employer</li>
              <li>• PCB: Based on LHDN tax tables</li>
            </ul>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
