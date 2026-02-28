"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockReceipts, Receipt } from "@/lib/mock-data"; // Added Receipt type import
import { formatCurrency, formatDate, formatTime } from "@/lib/formats";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listSales } from "@/api/sales.api";

const ITEMS_PER_PAGE = 10;

export default function SalesHistoryView() {
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  // --- ADDED MISSING STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // --- EXISTING STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Completed" | "Voided" | "Refunded"
  >("all");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const { data } = useSuspenseQuery({
    queryKey: ["sales", page, from, to, status],
    queryFn: () =>
      listSales({
        page,
        page_size: 20,
        from: from || undefined,
        to: to || undefined,
        status: status || undefined,
      }),
  });

  const sales = data?.data ?? [];
  console.log(sales);

  const filteredReceipts = useMemo(() => {
    return sales.filter((receipt) => {
      // Status filter
      if (
        statusFilter !== "all" &&
        receipt.status !== statusFilter.toUpperCase()
      ) {
        return false;
      }

      // Date range filter
      if (dateFromFilter) {
        const fromDate = new Date(dateFromFilter);
        // Normalize time for comparison
        const receiptDate = new Date(receipt.sale_timestamp);
        if (receiptDate < fromDate) return false;
      }

      if (dateToFilter) {
        const toDate = new Date(dateToFilter);
        toDate.setHours(23, 59, 59);
        const receiptDate = new Date(receipt.sale_timestamp);
        if (receiptDate > toDate) return false;
      }

      return true;
    });
  }, [statusFilter, dateFromFilter, dateToFilter]);

  const totalPages = Math.ceil(filteredReceipts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReceipts = filteredReceipts.slice(startIndex, endIndex);

  const handleViewReceipt = (receiptId: string) => {
    const receipt = mockReceipts.find((r) => r.id === receiptId);
    if (receipt) {
      setSelectedReceipt(receipt);
      setIsModalOpen(true);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="">
      <div className="space-y-8">
        {/* Filters */}
        <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6 ">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Date From
              </label>
              <Input
                type="date"
                value={dateFromFilter}
                onChange={(e) => {
                  setDateFromFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Date To
              </label>
              <Input
                type="date"
                value={dateToFilter}
                onChange={(e) => {
                  setDateToFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as any);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Voided">Voided</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDateFromFilter("");
                  setDateToFilter("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold">
            {filteredReceipts.length > 0 ? startIndex + 1 : 0}-
            {Math.min(endIndex, filteredReceipts.length)}
          </span>{" "}
          of <span className="font-semibold">{filteredReceipts.length}</span>{" "}
          transactions
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80  p-6 ">
          {paginatedReceipts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">No transactions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-slate-600">
                        Receipt #
                      </TableHead>
                      <TableHead className="text-slate-600">
                        Date/Time
                      </TableHead>
                      <TableHead className="text-slate-600">Customer</TableHead>
                      <TableHead className="text-right text-slate-600">
                        Total
                      </TableHead>
                      <TableHead className="text-slate-600">Status</TableHead>
                      <TableHead className="text-center text-slate-600">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReceipts.map((receipt) => (
                      <TableRow key={receipt.id} className="border-slate-100">
                        <TableCell className="font-medium text-slate-900">
                          {receipt.receipt_number}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          <div>
                            {formatDate(new Date(receipt.sale_timestamp))}
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatTime(new Date(receipt.sale_timestamp))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          <div className="font-medium">
                            {receipt.customer_name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {receipt.customer_email}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatCurrency(receipt.total_amount)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={receipt.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleViewReceipt(receipt.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 overflow-x-auto max-w-50 md:max-w-none">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 min-w-8 rounded text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
