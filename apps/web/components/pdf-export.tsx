"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Printer,
  X,
  CheckCircle
} from "lucide-react";
import { useState, useRef } from "react";

// Payslip PDF Generator
interface PayslipData {
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  payPeriod: string;
  payDate: string;
  earnings: {
    basicSalary: number;
    allowances: { name: string; amount: number }[];
    overtime: number;
    grossPay: number;
  };
  deductions: {
    epf: number;
    socso: number;
    eis: number;
    pcb: number;
    others: { name: string; amount: number }[];
    total: number;
  };
  netPay: number;
  employerContributions: {
    epf: number;
    socso: number;
    eis: number;
  };
}

export function generatePayslipPDF(data: PayslipData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text("PAYSLIP", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("TSH-2605 Enterprise Management System", 105, 28, { align: "center" });
  
  // Employee Info
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Employee Information", 20, 45);
  doc.setFont(undefined, "normal");
  
  doc.setFontSize(10);
  doc.text(`Name: ${data.employeeName}`, 20, 55);
  doc.text(`Employee ID: ${data.employeeId}`, 20, 62);
  doc.text(`Department: ${data.department}`, 20, 69);
  doc.text(`Position: ${data.position}`, 20, 76);
  
  // Pay Period
  doc.text(`Pay Period: ${data.payPeriod}`, 120, 55);
  doc.text(`Pay Date: ${data.payDate}`, 120, 62);
  
  // Line
  doc.line(20, 85, 190, 85);
  
  // Earnings
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Earnings", 20, 95);
  doc.setFont(undefined, "normal");
  
  doc.setFontSize(10);
  let y = 105;
  doc.text("Basic Salary", 20, y);
  doc.text(`RM ${data.earnings.basicSalary.toFixed(2)}`, 100, y);
  y += 7;
  
  data.earnings.allowances.forEach((allowance) => {
    doc.text(allowance.name, 20, y);
    doc.text(`RM ${allowance.amount.toFixed(2)}`, 100, y);
    y += 7;
  });
  
  if (data.earnings.overtime > 0) {
    doc.text("Overtime", 20, y);
    doc.text(`RM ${data.earnings.overtime.toFixed(2)}`, 100, y);
    y += 7;
  }
  
  doc.setFont(undefined, "bold");
  doc.text("Gross Pay", 20, y + 3);
  doc.text(`RM ${data.earnings.grossPay.toFixed(2)}`, 100, y + 3);
  doc.setFont(undefined, "normal");
  
  // Deductions
  y += 15;
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Deductions", 20, y);
  doc.setFont(undefined, "normal");
  
  y += 10;
  doc.setFontSize(10);
  doc.text(`EPF (Employee 11%)`, 20, y);
  doc.text(`RM ${data.deductions.epf.toFixed(2)}`, 100, y);
  y += 7;
  
  doc.text(`SOCSO (Employee 0.5%)`, 20, y);
  doc.text(`RM ${data.deductions.socso.toFixed(2)}`, 100, y);
  y += 7;
  
  doc.text(`EIS (Employee 0.2%)`, 20, y);
  doc.text(`RM ${data.deductions.eis.toFixed(2)}`, 100, y);
  y += 7;
  
  doc.text(`PCB (Tax)`, 20, y);
  doc.text(`RM ${data.deductions.pcb.toFixed(2)}`, 100, y);
  y += 7;
  
  data.deductions.others.forEach((deduction) => {
    doc.text(deduction.name, 20, y);
    doc.text(`RM ${deduction.amount.toFixed(2)}`, 100, y);
    y += 7;
  });
  
  doc.setFont(undefined, "bold");
  doc.text("Total Deductions", 20, y + 3);
  doc.text(`RM ${data.deductions.total.toFixed(2)}`, 100, y + 3);
  
  // Net Pay Box
  y += 20;
  doc.setFillColor(59, 130, 246);
  doc.rect(20, y - 10, 170, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("NET PAY", 30, y + 3);
  doc.text(`RM ${data.netPay.toFixed(2)}`, 170, y + 3, { align: "right" });
  doc.setTextColor(0, 0, 0);
  
  // Employer Contributions
  y += 30;
  doc.setFontSize(10);
  doc.text("Employer Contributions:", 20, y);
  y += 7;
  doc.text(`EPF (Employer): RM ${data.employerContributions.epf.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`SOCSO (Employer): RM ${data.employerContributions.socso.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`EIS (Employer): RM ${data.employerContributions.eis.toFixed(2)}`, 20, y);
  
  // Footer
  doc.setFontSize(8);
  doc.text("This is a computer-generated payslip and does not require signature.", 105, 280, { align: "center" });
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" });
  
  doc.save(`payslip-${data.employeeId}-${data.payPeriod}.pdf`);
}

// Purchase Order PDF Generator
interface PurchaseOrderData {
  poNumber: string;
  date: string;
  vendor: {
    name: string;
    address: string;
    contact: string;
  };
  items: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryDate: string;
  terms: string;
}

export function generatePOPDF(data: PurchaseOrderData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246);
  doc.text("PURCHASE ORDER", 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("TSH-2605 Enterprise Management System", 20, 38);
  
  // PO Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`PO Number: ${data.poNumber}`, 140, 30);
  doc.text(`Date: ${data.date}`, 140, 38);
  
  // Vendor Info
  doc.setFillColor(243, 244, 246);
  doc.rect(20, 50, 80, 40, "F");
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Vendor:", 25, 60);
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(data.vendor.name, 25, 68);
  doc.text(data.vendor.address, 25, 75);
  doc.text(data.vendor.contact, 25, 82);
  
  // Delivery Info
  doc.setFont(undefined, "bold");
  doc.text("Delivery Date:", 110, 60);
  doc.setFont(undefined, "normal");
  doc.text(data.deliveryDate, 110, 68);
  doc.setFont(undefined, "bold");
  doc.text("Terms:", 110, 78);
  doc.setFont(undefined, "normal");
  doc.text(data.terms, 110, 85);
  
  // Items Table
  let y = 110;
  doc.setFillColor(59, 130, 246);
  doc.rect(20, y - 5, 170, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("Item", 25, y);
  doc.text("Qty", 90, y);
  doc.text("Unit", 110, y);
  doc.text("Price", 135, y);
  doc.text("Total", 165, y);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  
  y += 15;
  data.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, y - 5, 170, 10, "F");
    }
    doc.text(item.description.substring(0, 30), 25, y);
    doc.text(item.quantity.toString(), 95, y);
    doc.text(item.unit, 112, y);
    doc.text(`RM ${item.unitPrice.toFixed(2)}`, 135, y);
    doc.text(`RM ${item.total.toFixed(2)}`, 165, y);
    y += 10;
  });
  
  // Totals
  y += 10;
  doc.setFont(undefined, "bold");
  doc.text("Subtotal:", 130, y);
  doc.text(`RM ${data.subtotal.toFixed(2)}`, 170, y, { align: "right" });
  y += 8;
  doc.text(`Tax (10%):`, 130, y);
  doc.text(`RM ${data.tax.toFixed(2)}`, 170, y, { align: "right" });
  y += 10;
  doc.setFillColor(59, 130, 246);
  doc.rect(120, y - 5, 70, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL:", 130, y + 2);
  doc.text(`RM ${data.total.toFixed(2)}`, 180, y + 2, { align: "right" });
  
  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("This Purchase Order is subject to our standard terms and conditions.", 105, 280, { align: "center" });
  
  doc.save(`po-${data.poNumber}.pdf`);
}

// PDF Export Button Component
interface PDFExportButtonProps {
  onExport: () => void;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: boolean;
}

export function PDFExportButton({ 
  onExport, 
  label = "Export PDF", 
  variant = "secondary",
  icon = true 
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setIsExporting(false);
    }
  };

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border-2 border-slate-300 hover:border-slate-400 text-slate-700",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${variants[variant]}`}
    >
      {showSuccess ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : icon ? (
        <FileText className="w-4 h-4" />
      ) : null}
      <span>{showSuccess ? "Exported!" : isExporting ? "Generating..." : label}</span>
    </motion.button>
  );
}

// Print Button
export function PrintButton({ elementId }: { elementId: string }) {
  const handlePrint = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    
    const doc = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save("document.pdf");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
    >
      <Printer className="w-4 h-4" />
      Print / PDF
    </motion.button>
  );
}
