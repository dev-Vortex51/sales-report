import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth, useAppDispatch } from "@core/hooks";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sales/new", label: "New Sale", icon: PlusCircle },
  { to: "/sales/history", label: "History", icon: Clock },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch({ type: "auth/logout" });
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card px-4 md:px-6">
      {/* Brand */}
      <span className="mr-8 text-lg font-semibold text-foreground">
        Sales Manager
      </span>

      {/* Desktop nav */}
      <div className="hidden flex-1 items-center gap-6 md:flex">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 pb-0.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* User / Logout (desktop) */}
      <div className="ml-auto hidden items-center gap-4 md:flex">
        <span className="text-sm text-muted-foreground">
          {user?.name ?? user?.email ?? "Owner"}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive-foreground"
          aria-label="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="ml-auto md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="absolute left-0 top-16 z-30 flex w-full flex-col gap-2 border-b border-border bg-card p-4 shadow-md md:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? "bg-muted font-semibold text-foreground"
                    : "text-muted-foreground"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive-foreground"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
