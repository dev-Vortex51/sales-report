import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "@core/components/AuthLayout";
import { AppLayout } from "@core/components/AppLayout";
import { LoginPage } from "@modules/auth/pages/LoginPage";
import { DashboardPage } from "@modules/reports/pages/DashboardPage";
import { NewSalePage } from "@modules/sales/pages/NewSalePage";
import { SalesHistoryPage } from "@modules/sales/pages/SalesHistoryPage";
import { WeeklyReportPage } from "@modules/reports/pages/WeeklyReportPage";
import { SettingsPage } from "@modules/settings/pages/SettingsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/sales/history" element={<SalesHistoryPage />} />
          <Route path="/reports/weekly" element={<WeeklyReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
