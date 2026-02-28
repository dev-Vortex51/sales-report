"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserDropdown from "./user-dropdown";
import {
  BarChart3,
  ShoppingCart,
  Calendar,
  History,
  Settings,
  Menu,
  X,
} from "lucide-react";

// Update items to use 'href' for routing instead of 'id'
const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/sales/new", label: "New Sale", icon: ShoppingCart },
  { href: "/reports/weekly", label: "Weekly Report", icon: Calendar },
  { href: "/sales/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* group relative overflow-hidden rounded-xl border border-border/40 bg-card/50  transition-all duration-300 hover:border-border/70 hover:bg-card/80 shadow-none  */}
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-border/40 lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border/40  px-6">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">
            Sales Manager
          </span>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if the current pathname matches the link
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                    : "text-slate-700 hover:bg-slate-50 border-l-2 border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4">
          <UserDropdown />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">
            Sales Manager
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden mt-14"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-14 z-40 h-screen w-64 border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                    : "text-slate-700 hover:bg-slate-50 border-l-2 border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4">
          <UserDropdown />
        </div>
      </aside>
    </>
  );
}
