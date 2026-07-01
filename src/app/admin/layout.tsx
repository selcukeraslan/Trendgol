"use client";

import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Giriş sayfası, korumalı düzen olmadan ham gösterilir.
  if (pathname === "/admin/giris") {
    return <div className="flex min-h-screen flex-col">{children}</div>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
