"use client";

import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { DataTable } from "../../../components/DataTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { FormModal } from "../../../components/FormModal";

interface ThreeWayMatch {
  id: string;
  poId: string;
  poNumber: string;
  grnId: string;
  grnNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorName: string;
  poAmount: number;
  grnAmount: number;
  invoiceAmount: number;
  quantityOrdered: number;
  quantityReceived: number;
  quantityInvoiced: number;
  unitPricePO: number;
  unitPriceInvoice: number;
  status: "MATCHED" | "PARTIAL_MATCH" | "UNMATCHED" | "EXCEPTION";
  variance: number;
  variancePercent: number;
  tolerancePercent: number;
  matchingDate: string;
  notes: string;
}

interface MatchDetails {
  po: {
    poNumber: string;
    orderDate: string;
    vendorName: string;
    lines: POLine[];
  };
  grn: {
    grnNumber: string;
    receiptDate: string;
    receivedBy: string;
    lines: GRNLine[];
  } | null;
  invoice: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    lines: InvoiceLine[];
  } | null;
}

interface POLine {
  lineNumber: number;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  totalPrice: number;
}

interface GRNLine {
  lineNumber: number;
  description: string;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  unitOfMeasure: string;
}

interface InvoiceLine {
  lineNumber: number;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  totalPrice: number;
}

const TOLERANCE = {
  quantity: 0.02, // ±2%
  price: 0.05,    // ±5%
  amount: 0.05,   // ±5%
};

// Calculate match status based on tolerances
function calculateMatchStatus(
  poAmount: number,
  grnAmount: number,
  invoiceAmount: number,
  qtyOrdered: number,
  qtyReceived: number,
  qtyInvoiced: number,
  pricePO: number,
  priceInvoice: number
): { status: ThreeWayMatch["status"]; variance: number; variancePercent: number } {
  // Calculate variances
  const qtyVariance = Math.abs(qtyOrdered - qtyReceived) / qtyOrdered;
  const priceVariance = Math.abs(pricePO - priceInvoice) / pricePO;
  const amountVariance = Math.abs(poAmount - invoiceAmount) / poAmount;
  
  const totalVariance = amountVariance;
  const variancePercent = totalVariance * 100;

  // Check if fully matched within tolerance
  if (
    qtyVariance <= TOLERANCE.quantity &&
    priceVariance <= TOLERANCE.price &&
    amountVariance <= TOLERANCE.amount
  ) {
    return { status: "MATCHED", variance: poAmount - invoiceAmount, variancePercent };
  }

  // Check if partial match (received but invoice has variance)
  if (qtyReceived > 0 && qtyVariance <= TOLERANCE.quantity) {
    return { status: "PARTIAL_MATCH", variance: poAmount - invoiceAmount, variancePercent };
  }

  // Check for exceptions (major variances)
  if (qtyVariance > TOLERANCE.quantity * 2 || priceVariance > TOLERANCE.price * 2) {
    return { status: "EXCEPTION", variance: poAmount - invoiceAmount, variancePercent };
  }

  return { status: "UNMATCHED", variance: poAmount - invoiceAmount, variancePercent };
}

const statusColors: Record<string, string> = {
  MATCHED: "bg-green-100 text-green-800 border-green-200",
  PARTIAL_MATCH: "bg-yellow-100 text-yellow-800 border-yellow-200",
  UNMATCHED: "bg-red-100 text-red-800 border-red-200",
  EXCEPTION: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusIcons: Record<string, string> = {
  MATCHED: "✓",
  PARTIAL_MATCH: "◐",
  UNMATCHED: "✗",
  EXCEPTION: "⚠",
};

export default function MatchingPage() {
  const { data: matches, loading, refetch } = useApi<ThreeWayMatch[]>("/api/ps/matching");
  const [selectedMatch, setSelectedMatch] = useState<ThreeWayMatch | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const loadMatchDetails = async (matchId: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/ps/matching/${matchId}/details`);
      if (response.ok) {
        const data = await response.json();
        setMatchDetails(data);
      }
    } catch (error) {
      console.error("Error loading match details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (match: ThreeWayMatch) => {
    setSelectedMatch(match);
    setDetailsModalOpen(true);
    loadMatchDetails(match.id);
  };

  const handleApproveMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/ps/matching/${matchId}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        refetch();
        setDetailsModalOpen(false);
      }
    } catch (error) {
      console.error("Error approving match:", error);
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/ps/matching/${matchId}/reject`, {
        method: "POST",
      });
      if (response.ok) {
        refetch();
        setDetailsModalOpen(false);
      }
    } catch (error) {
      console.error("Error rejecting match:", error);
    }
  };

  const filteredMatches = matches?.filter((m) =>
    filterStatus === "ALL" ? true : m.status === filterStatus
  );

  const matchedCount = matches?.filter((m) => m.status === "MATCHED").length || 0;
  const partialCount = matches?.filter((m) => m.status === "PARTIAL_MATCH").length || 0;
  const unmatchedCount = matches?.filter((m) => m.status === "UNMATCHED").length || 0;
  const exceptionCount = matches?.filter((m) => m.status === "EXCEPTION").length || 0;

  const columns = [
    { key: "poNumber", header: "PO Number" },
    { key: "grnNumber", header: "GRN Number" },
    { key: "invoiceNumber", header: "Invoice Number" },
    { key: "vendorName", header: "Vendor" },
    {
      key: "poAmount",
      header: "PO Amount",
      render: (item: ThreeWayMatch) => formatCurrency(item.poAmount),
    },
    {
      key: "grnAmount",
      header: "GRN Amount",
      render: (item: ThreeWayMatch) => formatCurrency(item.grnAmount),
    },
    {
      key: "invoiceAmount",
      header: "Invoice Amount",
      render: (item: ThreeWayMatch) => (
        <span className={getAmountClass(item.poAmount, item.invoiceAmount)}>
          {formatCurrency(item.invoiceAmount)}
        </span>
      ),
    },
    {
      key: "variance",
      header: "Variance",
      render: (item: ThreeWayMatch) => (
        <span
          className={
            Math.abs(item.variancePercent) > 5
              ? "text-red-600 font-medium"
              : Math.abs(item.variancePercent) > 2
              ? "text-yellow-600"
              : "text-green-600"
          }
        >
          {item.variancePercent > 0 ? "-" : "+"}
          {Math.abs(item.variancePercent).toFixed(1)}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: ThreeWayMatch) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${statusColors[item.status]}`}
        >
          <span>{statusIcons[item.status]}</span>
          {item.status.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: ThreeWayMatch) => (
        <button
          onClick={() => handleViewDetails(item)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Details
        </button>
      ),
    },
  ];

  if (loading) {
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
          <h1 className="text-2xl font-bold">3-Way Matching</h1>
          <p className="text-gray-500">
            Compare Purchase Orders, Goods Receipts, and Invoices
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Tolerance Info */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-blue-800 mb-2">Matching Tolerances:</p>
        <div className="flex gap-6 text-sm text-blue-700">
          <span>Quantity: ±2%</span>
          <span>Price: ±5%</span>
          <span>Amount: ±5%</span>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="bg-green-50 border border-green-200 p-4 rounded-lg cursor-pointer hover:bg-green-100"
          onClick={() => setFilterStatus("MATCHED")}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <div>
              <p className="text-sm text-gray-600">Matched</p>
              <p className="text-2xl font-bold text-green-700">{matchedCount}</p>
            </div>
          </div>
        </div>
        <div
          className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg cursor-pointer hover:bg-yellow-100"
          onClick={() => setFilterStatus("PARTIAL_MATCH")}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">◐</span>
            <div>
              <p className="text-sm text-gray-600">Partial Match</p>
              <p className="text-2xl font-bold text-yellow-700">{partialCount}</p>
            </div>
          </div>
        </div>
        <div
          className="bg-red-50 border border-red-200 p-4 rounded-lg cursor-pointer hover:bg-red-100"
          onClick={() => setFilterStatus("UNMATCHED")}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">✗</span>
            <div>
              <p className="text-sm text-gray-600">Unmatched</p>
              <p className="text-2xl font-bold text-red-700">{unmatchedCount}</p>
            </div>
          </div>
        </div>
        <div
          className="bg-orange-50 border border-orange-200 p-4 rounded-lg cursor-pointer hover:bg-orange-100"
          onClick={() => setFilterStatus("EXCEPTION")}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠</span>
            <div>
              <p className="text-sm text-gray-600">Exceptions</p>
              <p className="text-2xl font-bold text-orange-700">{exceptionCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search matches..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="MATCHED">Matched</option>
          <option value="PARTIAL_MATCH">Partial Match</option>
          <option value="UNMATCHED">Unmatched</option>
          <option value="EXCEPTION">Exception</option>
        </select>
        {filterStatus !== "ALL" && (
          <button
            onClick={() => setFilterStatus("ALL")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Matches Table */}
      {filteredMatches && filteredMatches.length > 0 ? (
        <DataTable columns={columns} data={filteredMatches} />
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          <p className="text-lg mb-2">📋 No matching records found</p>
          <p className="text-sm">Create POs, GRNs, and Invoices to see matching results</p>
        </div>
      )}

      {/* Match Details Modal */}
      {selectedMatch && (
        <FormModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`3-Way Match Details - ${selectedMatch.poNumber}`}
          onSubmit={() => {}}
          hideSubmit={true}
        >
          {detailsLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-lg border ${statusColors[selectedMatch.status]}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{statusIcons[selectedMatch.status]}</span>
                    <span className="font-semibold">
                      Status: {selectedMatch.status.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-sm">
                    Variance: {selectedMatch.variancePercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Three-Way Comparison Visual */}
              <div className="grid grid-cols-3 gap-4">
                {/* Purchase Order */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-center mb-3">
                    <span className="text-3xl">📄</span>
                    <h4 className="font-semibold text-blue-800">Purchase Order</h4>
                    <p className="text-sm text-blue-600">{selectedMatch.poNumber}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedMatch.poAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">
                        {selectedMatch.quantityOrdered}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Price:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedMatch.unitPricePO)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Goods Receipt */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-center mb-3">
                    <span className="text-3xl">📦</span>
                    <h4 className="font-semibold text-green-800">Goods Receipt</h4>
                    <p className="text-sm text-green-600">{selectedMatch.grnNumber}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedMatch.grnAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span
                        className={`font-medium ${getVarianceClass(
                          selectedMatch.quantityOrdered,
                          selectedMatch.quantityReceived,
                          TOLERANCE.quantity
                        )}`}
                      >
                        {selectedMatch.quantityReceived}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Qty Variance:</span>
                      <span
                        className={`font-medium ${
                          Math.abs(
                            (selectedMatch.quantityOrdered -
                              selectedMatch.quantityReceived) /
                              selectedMatch.quantityOrdered
                          ) > TOLERANCE.quantity
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {(
                          ((selectedMatch.quantityOrdered -
                            selectedMatch.quantityReceived) /
                            selectedMatch.quantityOrdered) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invoice */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-center mb-3">
                    <span className="text-3xl">🧾</span>
                    <h4 className="font-semibold text-purple-800">Invoice</h4>
                    <p className="text-sm text-purple-600">{selectedMatch.invoiceNumber}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span
                        className={`font-medium ${getVarianceClass(
                          selectedMatch.poAmount,
                          selectedMatch.invoiceAmount,
                          TOLERANCE.amount
                        )}`}
                      >
                        {formatCurrency(selectedMatch.invoiceAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">
                        {selectedMatch.quantityInvoiced}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit Price:</span>
                      <span
                        className={`font-medium ${getVarianceClass(
                          selectedMatch.unitPricePO,
                          selectedMatch.unitPriceInvoice,
                          TOLERANCE.price
                        )}`}
                      >
                        {formatCurrency(selectedMatch.unitPriceInvoice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variance Analysis */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Variance Analysis</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">PO vs GRN Quantity</p>
                    <p
                      className={`font-medium ${getVarianceClass(
                        selectedMatch.quantityOrdered,
                        selectedMatch.quantityReceived,
                        TOLERANCE.quantity
                      )}`}
                    >
                      {selectedMatch.quantityOrdered - selectedMatch.quantityReceived > 0
                        ? "-"
                        : "+"}
                      {Math.abs(
                        selectedMatch.quantityOrdered - selectedMatch.quantityReceived
                      ).toFixed(0)}{" "}
                      (
                      {(
                        (Math.abs(
                          selectedMatch.quantityOrdered - selectedMatch.quantityReceived
                        ) /
                          selectedMatch.quantityOrdered) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">PO vs Invoice Amount</p>
                    <p
                      className={`font-medium ${getVarianceClass(
                        selectedMatch.poAmount,
                        selectedMatch.invoiceAmount,
                        TOLERANCE.amount
                      )}`}
                    >
                      {selectedMatch.poAmount - selectedMatch.invoiceAmount > 0
                        ? "-"
                        : "+"}
                      {formatCurrency(
                        Math.abs(selectedMatch.poAmount - selectedMatch.invoiceAmount)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Price Variance</p>
                    <p
                      className={`font-medium ${getVarianceClass(
                        selectedMatch.unitPricePO,
                        selectedMatch.unitPriceInvoice,
                        TOLERANCE.price
                      )}`}
                    >
                      {selectedMatch.unitPricePO - selectedMatch.unitPriceInvoice > 0
                        ? "-"
                        : "+"}
                      {formatCurrency(
                        Math.abs(
                          selectedMatch.unitPricePO - selectedMatch.unitPriceInvoice
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Line Items Comparison */}
              {matchDetails && (
                <div>
                  <h4 className="font-semibold mb-3">Line Items Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left">Description</th>
                          <th className="px-3 py-2 text-center">PO Qty</th>
                          <th className="px-3 py-2 text-center">GRN Qty</th>
                          <th className="px-3 py-2 text-center">Inv Qty</th>
                          <th className="px-3 py-2 text-right">PO Price</th>
                          <th className="px-3 py-2 text-right">Inv Price</th>
                          <th className="px-3 py-2 text-center">Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchDetails.po.lines.map((line, idx) => {
                          const grnLine = matchDetails.grn?.lines[idx];
                          const invLine = matchDetails.invoice?.lines[idx];
                          const qtyMatch =
                            grnLine &&
                            Math.abs(line.quantity - grnLine.quantityReceived) /
                              line.quantity <=
                              TOLERANCE.quantity;
                          const priceMatch =
                            invLine &&
                            Math.abs(line.unitPrice - invLine.unitPrice) /
                              line.unitPrice <=
                              TOLERANCE.price;

                          return (
                            <tr key={idx} className="border-b">
                              <td className="px-3 py-2">{line.description}</td>
                              <td className="px-3 py-2 text-center">{line.quantity}</td>
                              <td
                                className={`px-3 py-2 text-center ${
                                  grnLine
                                    ? qtyMatch
                                      ? "text-green-600"
                                      : "text-red-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {grnLine?.quantityReceived || "-"}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {invLine?.quantity || "-"}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {formatCurrency(line.unitPrice)}
                              </td>
                              <td
                                className={`px-3 py-2 text-right ${
                                  invLine
                                    ? priceMatch
                                      ? "text-green-600"
                                      : "text-red-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {invLine
                                  ? formatCurrency(invLine.unitPrice)
                                  : "-"}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {qtyMatch && priceMatch ? (
                                  <span className="text-green-600">✓</span>
                                ) : (
                                  <span className="text-red-600">✗</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedMatch.status !== "MATCHED" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApproveMatch(selectedMatch.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✓ Approve with Variance
                  </button>
                  <button
                    onClick={() => handleRejectMatch(selectedMatch.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    ✗ Reject & Query
                  </button>
                </div>
              )}
            </div>
          )}
        </FormModal>
      )}
    </div>
  );
}

// Helper functions
function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(value);
}

function getAmountClass(expected: number, actual: number): string {
  const variance = Math.abs(expected - actual) / expected;
  if (variance <= TOLERANCE.amount) return "text-green-600";
  if (variance <= TOLERANCE.amount * 2) return "text-yellow-600";
  return "text-red-600 font-medium";
}

function getVarianceClass(expected: number, actual: number, tolerance: number): string {
  const variance = Math.abs(expected - actual) / expected;
  if (variance <= tolerance) return "text-green-600";
  if (variance <= tolerance * 2) return "text-yellow-600";
  return "text-red-600 font-medium";
}
