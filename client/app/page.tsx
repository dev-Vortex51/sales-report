import { getDashboard } from "@/api/reports.api";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/formats";
import DashboardView from "@/views/DashboardView";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Download } from "lucide-react";
import React, { Suspense } from "react";

export default async function DashboardPage() {
  const currentDate = new Date();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="space-y-8 max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Today — {formatDate(currentDate)}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back! Here's your sales overview.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem disabled>Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Suspense fallback={<Loader />}>
          <DashboardView />
        </Suspense>
      </div>
    </main>
  );
}
