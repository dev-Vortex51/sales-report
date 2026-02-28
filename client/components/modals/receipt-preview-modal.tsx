'use client';

import { useAppContext } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/lib/mock-data';
import { formatCurrency, formatDate, formatTime, calculateTax } from '@/lib/formats';
import { X, Mail, Download } from 'lucide-react';

interface ReceiptPreviewModalProps {
  receipt: Receipt;
}

export default function ReceiptPreviewModal({
  receipt,
}: ReceiptPreviewModalProps) {
  const { setIsModalOpen } = useAppContext();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header with Close */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Receipt Preview</h2>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Business Info */}
          <div className="border-b border-slate-200 pb-6 text-center">
            <h3 className="text-2xl font-bold text-slate-900">Sales Manager</h3>
            <p className="mt-1 text-sm text-slate-500">Your Business Sales Hub</p>
          </div>

          {/* Receipt Header */}
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-medium text-slate-900">
                {receipt.receiptNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium text-slate-900">
                {formatDate(receipt.date, true)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium text-slate-900">
                {formatTime(receipt.date)}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Customer
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {receipt.customerName}
            </p>
            <p className="text-sm text-slate-600">{receipt.customerEmail}</p>
          </div>

          {/* Items Table */}
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
              Items
            </p>
            <div className="space-y-3">
              {receipt.items.map((item, index) => {
                const lineSubtotal = item.quantity * item.unitPrice;
                const lineTax = calculateTax(lineSubtotal, item.taxRate);
                return (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-900 font-medium">
                        {item.description}
                      </span>
                      <span className="text-slate-900 font-medium">
                        {formatCurrency(lineSubtotal + lineTax)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
                      <span>Tax: {formatCurrency(lineTax)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal:</span>
              <span className="text-slate-900">
                {formatCurrency(receipt.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax ({receipt.items[0]?.taxRate}%):</span>
              <span className="text-slate-900">
                {formatCurrency(receipt.tax)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-slate-900">Total:</span>
              <span className="text-slate-900">
                {formatCurrency(receipt.total)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Email action
                alert('Email receipt feature coming soon!');
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Receipt
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Download action
                alert('Download PDF feature coming soon!');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-700"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
