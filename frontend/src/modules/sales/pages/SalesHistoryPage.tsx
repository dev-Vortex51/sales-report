import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listSales, getSaleById } from "../api/sales.api";
import { ReceiptPreviewModal } from "../components/ReceiptPreviewModal";
import { Badge } from "@core/components/Badge";
import { Button } from "@core/components/Button";
import { Input } from "@core/components/Input";
import type { SaleDetail } from "../types/sales.types";

export function SalesHistoryPage() {
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");

  // Receipt modal state
  const [selectedSale, setSelectedSale] = useState<SaleDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
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
  const totalPages = data
    ? Math.ceil(data.meta.total / data.meta.page_size)
    : 1;

  async function handleView(id: string) {
    const detail = await getSaleById(id);
    setSelectedSale(detail);
    setModalOpen(true);
  }

  const statusVariant = (s: string) =>
    s === "COMPLETED" ? "success" : s === "VOID" ? "error" : "warning";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-foreground">Sales History</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Input
          label="From"
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />
        <Input
          label="To"
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="VOID">Voided</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setFrom("");
            setTo("");
            setStatus("");
            setPage(1);
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs font-semibold uppercase text-muted-foreground">
              <th className="px-4 py-3">Receipt #</th>
              <th className="px-4 py-3">Date/Time</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sales.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <p>No sales found for the selected filters.</p>
                  {(from || to || status) && (
                    <button
                      onClick={() => {
                        setFrom("");
                        setTo("");
                        setStatus("");
                        setPage(1);
                      }}
                      className="mt-2 text-primary hover:underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-border hover:bg-muted"
                >
                  <td className="px-4 py-3">{sale.receipt_number}</td>
                  <td className="px-4 py-3">
                    {new Date(sale.sale_timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {sale.customer_name ?? "Walk-in"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    £{sale.total_amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(sale.status)}>
                      {sale.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" onClick={() => handleView(sale.id)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ◀
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ▶
          </Button>
        </div>
      )}

      <ReceiptPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
}
