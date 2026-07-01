"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { publicNavItems, siteName } from "@/config/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-heading">
      <span className="flex size-8 items-center justify-center rounded-md bg-brand font-bold text-brand-foreground">
        HS
      </span>
      <span className="text-lg font-bold tracking-tight">{siteName}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        {/* Masaüstü menü */}
        <nav className="hidden items-center gap-1 lg:flex">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/iletisim"
            className={cn(
              buttonVariants({ size: "lg" }),
              "hidden sm:inline-flex",
            )}
          >
            Takımını Kaydet
          </Link>

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
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">{siteName}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {publicNavItems.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                          isActive(pathname, item.href)
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ))}
                <SheetClose
                  render={
                    <Link
                      href="/iletisim"
                      className={cn(buttonVariants({ size: "lg" }), "mt-4")}
                    >
                      Takımını Kaydet
                    </Link>
                  }
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
