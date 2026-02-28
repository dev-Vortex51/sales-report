import Loader from "@/components/loader";
import SalesHistoryView from "@/views/SalesHistoryView";
import React, { Suspense } from "react";

export default function SalesHistoryPage() {
  return (
    <main className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales History</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all past transactions
          </p>
        </div>

        <Suspense fallback={<Loader />}>
          <SalesHistoryView />
        </Suspense>
      </div>
    </main>
  );
}
