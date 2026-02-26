import { Outlet } from "react-router-dom";

/**
 * Layout wrapper for unauthenticated routes (Login).
 * Centers content in a narrow container (container.sm).
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main
        className="w-full rounded-xl border border-border bg-card p-6 shadow-sm"
        style={{
          maxWidth: "28rem",
        }} /* TODO: No token match for --container-sm */
      >
        <Outlet />
      </main>
    </div>
  );
}
