"use client";

import { useState } from "react";
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
// Make sure these types are correctly exported from your lib
import { SaleItem, Receipt } from "@/lib/mock-data";
import { formatCurrency, calculateTax, calculateTotal } from "@/lib/formats";
import { X, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createSale } from "@/api/sales.api";

export default function SalesEntryView() {
  // --- ADDED STATE HOOKS ---
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // --- EXISTING INPUT STATE ---
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [taxRate, setTaxRate] = useState("20");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const handleAddItem = () => {
    if (!description || !unitPrice) return;

    const qty = Math.max(1, parseInt(quantity) || 1);
    const price = parseFloat(unitPrice);
    const rate = parseInt(taxRate);

    const newItem: SaleItem = {
      id: Date.now().toString(),
      description,
      quantity: qty,
      unitPrice: price,
      taxRate: rate,
    };

    setCartItems([...cartItems, newItem]);
    // Reset item fields
    setDescription("");
    setQuantity("1");
    setUnitPrice("");
    setTaxRate("20");
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const calculateLineTotal = (item: SaleItem) => {
    const lineSubtotal = item.quantity * item.unitPrice;
    const lineTax = calculateTax(lineSubtotal, item.taxRate);
    return calculateTotal(lineSubtotal, lineTax);
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const totalTax = cartItems.reduce((sum, item) => {
    const lineSubtotal = item.quantity * item.unitPrice;
    return sum + calculateTax(lineSubtotal, item.taxRate);
  }, 0);

  const total = calculateTotal(subtotal, totalTax);
  const { mutate, isPending } = useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      const receipt: Receipt = {
        id: data.sale_id,
        receiptNumber: data.receipt_number,
        date: new Date(data.created_at),
        customerName,
        customerEmail,
        items: cartItems,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        total: Number(total.toFixed(2)),
        status: "Completed",
      };
      setSelectedReceipt(receipt);
      setIsModalOpen(true);
      // reset form
      setCartItems([]);
      setCustomerName("");
      setCustomerEmail("");
    },
    onError: (err: any) => {
      console.error("Create sale error", err);
      alert(err?.response?.data?.message || "Failed to create sale");
    },
  });

  const handleCompleteSale = async () => {
    if (!customerName || !customerEmail || cartItems.length === 0) return;

    const payload = {
      customer_name: customerName,
      customer_email: customerEmail,
      items: cartItems.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        tax_rate: it.taxRate,
      })),
    };

    mutate(payload);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
      setCustomerName("");
      setCustomerEmail("");
      setDescription("");
      setQuantity("1");
      setUnitPrice("");
    }
  };

  return (
    <div className="min-h-screen  p-4 md:p-8">
      {/* NOTE: You'll need to render a Modal/Dialog here using 
         isModalOpen and selectedReceipt to actually see the receipt!
      */}
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New Sale</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add items to cart and complete the sale
          </p>
        </div>

        {/* Add Item Section */}
        <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6 ">
          <h2 className="text-lg font-semibold text-slate-900">Add Item</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <Input
                placeholder="Item name"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Qty
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Price
              </label>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddItem}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!description || !unitPrice}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80  p-6">
          <h2 className="text-lg font-semibold text-slate-900">Cart</h2>
          {cartItems.length === 0 ? (
            <p className="mt-4 text-center text-sm text-slate-500">
              No items in cart yet
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(calculateLineTotal(item))}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 border-t pt-4 text-right">
                <p className="text-sm text-slate-600">Total Due</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 p-6 ">
          <h2 className="text-lg font-semibold text-slate-900">Customer</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleCompleteSale}
            disabled={isPending || cartItems.length === 0 || !customerName}
            className="bg-blue-600 px-8"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Complete Sale"}
          </Button>
        </div>
      </div>
    </div>
  );
}
