import { useState } from "react";
import type { SaleItem } from "../types/sales.types";
import { Input } from "@core/components/Input";
import { Button } from "@core/components/Button";

interface CartTableProps {
  items: SaleItem[];
  onRemove: (index: number) => void;
}

/** Renders the line items currently in the cart with totals. */
export function CartTable({ items, onRemove }: CartTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No items added yet. Use the form above to add items.
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const totalTax = items.reduce(
    (sum, i) => sum + i.quantity * i.unit_price * (i.tax_rate / 100),
    0,
  );
  const total = subtotal + totalTax;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left text-xs font-semibold uppercase text-muted-foreground">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Tax</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const lineTax =
              item.quantity * item.unit_price * (item.tax_rate / 100);
            const lineTotal = item.quantity * item.unit_price + lineTax;
            return (
              <tr key={idx} className="border-b border-border">
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3 text-right">{item.quantity}</td>
                <td className="px-4 py-3 text-right">
                  £{item.unit_price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">£{lineTax.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  £{lineTotal.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onRemove(idx)}
                    className="text-muted-foreground hover:text-destructive-foreground"
                    aria-label={`Remove ${item.description}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-b border-border">
            <td
              colSpan={5}
              className="px-4 py-2 text-right text-muted-foreground"
            >
              Subtotal
            </td>
            <td className="px-4 py-2 text-right">£{subtotal.toFixed(2)}</td>
            <td />
          </tr>
          <tr className="border-b border-border">
            <td
              colSpan={5}
              className="px-4 py-2 text-right text-muted-foreground"
            >
              Tax
            </td>
            <td className="px-4 py-2 text-right">£{totalTax.toFixed(2)}</td>
            <td />
          </tr>
          <tr>
            <td colSpan={5} className="px-4 py-3 text-right font-bold">
              Total
            </td>
            <td className="px-4 py-3 text-right font-bold">
              £{total.toFixed(2)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ── Add Item Form ── */

interface AddItemFormProps {
  onAdd: (item: SaleItem) => void;
  defaultTaxRate?: number;
}

export function AddItemForm({ onAdd, defaultTaxRate = 20 }: AddItemFormProps) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [taxRate, setTaxRate] = useState(String(defaultTaxRate));

  function handleAdd() {
    if (!description.trim() || !unitPrice) return;
    onAdd({
      description: description.trim(),
      quantity: Math.max(1, parseInt(quantity, 10) || 1),
      unit_price: Math.max(0, parseFloat(parseFloat(unitPrice).toFixed(2))),
      tax_rate: Math.max(0, parseFloat(taxRate) || 0),
    });
    setDescription("");
    setQuantity("1");
    setUnitPrice("");
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
        Add Item
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_80px_120px_100px_auto]">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item name"
        />
        <Input
          label="Qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          label="Price (£)"
          type="number"
          min={0}
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          placeholder="0.00"
        />
        <Input
          label="Tax %"
          type="number"
          min={0}
          step="0.5"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
        />
        <div className="flex items-end">
          <Button variant="secondary" onClick={handleAdd} type="button">
            + Add
          </Button>
        </div>
      </div>
    </div>
  );
}
