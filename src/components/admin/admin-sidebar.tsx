import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { siteName } from "@/config/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/30 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5 font-heading">
        <span className="flex size-8 items-center justify-center rounded-md bg-brand font-bold text-brand-foreground">
          HS
        </span>
        <span className="text-sm font-bold tracking-tight">
          {siteName}
          <span className="block text-xs font-normal text-muted-foreground">
            Yönetim Paneli
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <AdminNav />
      </div>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Siteyi Görüntüle
        </Link>
      </div>
    </aside>
  );
}
