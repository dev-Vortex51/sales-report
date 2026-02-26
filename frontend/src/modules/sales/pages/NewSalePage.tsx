import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddItemForm, CartTable } from "../components/CartTable";
import { ReceiptPreviewModal } from "../components/ReceiptPreviewModal";
import { Input } from "@core/components/Input";
import { Button } from "@core/components/Button";
import { Modal } from "@core/components/Modal";
import { toast } from "@core/components/Toast";
import { createSale, getSaleById } from "../api/sales.api";
import type { SaleItem, SaleDetail } from "../types/sales.types";

export function NewSalePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Receipt preview state
  const [receiptSale, setReceiptSale] = useState<SaleDetail | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  function addItem(item: SaleItem) {
    setItems((prev) => [...prev, item]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCompleteSale() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await createSale({
        items,
        customer_name: customerName || undefined,
        customer_email: customerEmail || undefined,
      });
      toast(
        "success",
        `Sale #${res.receipt_number} recorded — £${res.total_amount.toFixed(2)}`,
      );

      // Show receipt preview
      const detail = await getSaleById(res.sale_id);
      setReceiptSale(detail);
      setReceiptOpen(true);

      // Reset form
      setItems([]);
      setCustomerName("");
      setCustomerEmail("");
    } catch {
      toast("error", "Failed to record sale. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-foreground">New Sale</h1>

      <AddItemForm onAdd={addItem} />

      <CartTable items={items} onRemove={removeItem} />

      {/* Customer info (optional) */}
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
          Customer (optional)
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            if (items.length > 0) {
              setCancelOpen(true);
            } else {
              navigate("/dashboard");
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={items.length === 0}
          loading={loading}
          onClick={handleCompleteSale}
        >
          Complete Sale
        </Button>
      </div>

      {/* Cancel confirmation dialog */}
      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Discard this sale?"
        size="sm"
      >
        <p className="text-sm text-muted-foreground">
          You have {items.length} item{items.length !== 1 ? "s" : ""} in your
          cart. Discarding will lose all items.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCancelOpen(false)}>
            Keep Editing
          </Button>
          <Button variant="danger" onClick={() => navigate("/dashboard")}>
            Discard
          </Button>
        </div>
      </Modal>

      <ReceiptPreviewModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        sale={receiptSale}
      />
    </div>
  );
}
