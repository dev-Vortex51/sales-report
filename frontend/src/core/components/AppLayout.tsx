import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@core/hooks";
import { Navbar } from "./Navbar";

/**
 * Layout wrapper for authenticated routes.
 * Redirects to /login if not authenticated.
 */
export function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main
        id="main-content"
        className="mx-auto px-4 py-6 md:px-6"
        style={{
          maxWidth: "80rem",
        }} /* TODO: No token match for --container-xl */
      >
        <Outlet />
      </main>
    </div>
  );
}
