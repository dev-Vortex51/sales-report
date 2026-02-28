import BranchSelector from "@/components/data-selector";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeeklyReportView from "@/views/WeeklyReportView";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Suspense } from "react";

export default function WeeklyReportPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="space-y-8 max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Weekly Report</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your sales performance for the week
          </p>
        </div>

        <Suspense fallback={<Loader />}>
          <WeeklyReportView />
        </Suspense>
      </div>
    </main>
  );
}
