"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu } from "lucide-react";

import { siteName } from "@/config/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminTopbar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await logout();
    router.replace("/admin/giris");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobil menü */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menüyü aç"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left">{siteName} Yönetim</SheetTitle>
            </SheetHeader>
            <div className="px-3">
              <AdminNav onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-heading font-bold tracking-tight">
          Yönetim Paneli
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Siteyi Gör
        </Link>
        <ThemeToggle />
        {user ? (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user.name}
          </span>
        ) : null}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" aria-hidden="true" />
          Çıkış
        </Button>
      </div>
    </header>
  );
}
