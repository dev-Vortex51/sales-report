"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

export function LayoutContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Don't show sidebar on auth pages (login, register, etc.)
  const isAuthPage =
    pathname.startsWith("/(auth)") || pathname.startsWith("/login");

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <main className={isAuthPage ? "" : "lg:pl-64 pt-14 lg:pt-0"}>
        {children}
      </main>
    </>
  );
}
