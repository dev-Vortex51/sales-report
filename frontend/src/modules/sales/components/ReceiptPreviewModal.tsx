import { useState } from "react";
import type { SaleDetail } from "../types/sales.types";
import { Modal } from "@core/components/Modal";
import { Button } from "@core/components/Button";
import { toast } from "@core/components/Toast";
import { downloadReceiptPdf } from "../api/sales.api";
import { apiClient } from "@core/api-client";

interface ReceiptPreviewModalProps {
  open: boolean;
  onClose: () => void;
  sale: SaleDetail | null;
}

export function ReceiptPreviewModal({
  open,
  onClose,
  sale,
}: ReceiptPreviewModalProps) {
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );

  if (!sale) return null;

  const subtotal = sale.total_before_tax;
  const tax = sale.tax_amount;
  const total = sale.total_amount;
  const hasEmail = !!sale.customer_email;

  async function handleEmailReceipt() {
    if (!hasEmail) return;
    setEmailStatus("sending");
    try {
      await apiClient.post(`/sales/${sale?.id}/email-receipt`);
      setEmailStatus("sent");
      toast("success", "Receipt emailed successfully.");
    } catch {
      setEmailStatus("idle");
      toast("error", "Failed to send receipt email.");
    }
  }

  async function handleDownloadPdf() {
    try {
      const blobUrl = await downloadReceiptPdf(sale.id);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast("error", "Failed to download receipt PDF.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Receipt Preview" size="md">
      <div className="flex flex-col gap-4 text-sm">
        {/* Business header — populated from settings in production */}
        <div>
          <p className="font-semibold">Business Name</p>
          <p className="text-muted-foreground">Business Address line 1</p>
          <p className="text-muted-foreground">Business Address line 2</p>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <p>Receipt #: {sale.receipt_number}</p>
          <p>{new Date(sale.sale_timestamp).toLocaleString()}</p>
        </div>

        {sale.customer_name && (
          <p className="text-muted-foreground">
            Customer: {sale.customer_name}
          </p>
        )}

        <hr className="border-border" />

        {/* Line items with per-item tax */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <>
                <tr key={item.id}>
                  <td className="py-1">{item.description}</td>
                  <td className="py-1 text-right">{item.quantity}</td>
                  <td className="py-1 text-right">
                    £{item.unit_price.toFixed(2)}
                  </td>
                  <td className="py-1 text-right">
                    £{item.line_total_before_tax.toFixed(2)}
                  </td>
                </tr>
                <tr key={`${item.id}-tax`}>
                  <td
                    colSpan={3}
                    className="py-0 pl-4 text-xs text-muted-foreground"
                  >
                    Tax ({item.tax_rate}%)
                  </td>
                  <td className="py-0 text-right text-xs text-muted-foreground">
                    £{item.tax_amount.toFixed(2)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>

        <hr className="border-border" />

        <div className="flex flex-col items-end gap-1">
          <p>Subtotal: £{subtotal.toFixed(2)}</p>
          <p>Tax: £{tax.toFixed(2)}</p>
          <p className="mt-1 border-t-2 border-foreground pt-1 text-base font-bold">
            Total: £{total.toFixed(2)}
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Thank you for your purchase.
        </p>
      </div>

      {/* Actions — Close, Download PDF, Email Receipt */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownloadPdf}>
          Download PDF
        </Button>
        {hasEmail && (
          <Button
            variant="primary"
            onClick={handleEmailReceipt}
            disabled={emailStatus === "sent"}
            loading={emailStatus === "sending"}
          >
            {emailStatus === "sent" ? "Sent ✓" : "Email Receipt"}
          </Button>
        )}
      </div>
    </Modal>
  );
}
