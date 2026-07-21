"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { useAsyncData } from "@/hooks/use-async-data";
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

const liveStreamUrl = "https://www.youtube.com/@trendgolligi";

function LiveStreamLink({
  mobile = false,
  className,
  ...props
}: { mobile?: boolean } & React.ComponentProps<"a">) {
  return (
    <a
      href={liveStreamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold text-foreground transition-colors hover:bg-red-500/10 hover:text-red-500",
        mobile ? "px-3 py-2.5" : "px-2 py-2",
        className,
      )}
      {...props}
    >
      <span className="relative flex size-2.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-red-600" />
      </span>
      Canlı Yayın
      <span className="sr-only">(YouTube&apos;da yeni sekmede açılır)</span>
    </a>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLogo({ logoUrl }: { logoUrl?: string }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 whitespace-nowrap font-heading"
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={siteName}
          className="size-8 rounded-md object-cover"
        />
      ) : (
        <span className="flex size-8 items-center justify-center rounded-md bg-brand font-bold text-brand-foreground">
          HS
        </span>
      )}
      <span className="text-lg font-bold tracking-tight">{siteName}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { data: settings } = useAsyncData<SiteSettings>(
    () => getSiteSettings(),
    [],
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-5 lg:px-6">
        <BrandLogo logoUrl={settings?.logoUrl} />

        {/* Masaüstü menü */}
        <nav className="hidden shrink-0 items-center min-[1100px]:flex">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors hover:text-foreground",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <LiveStreamLink />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
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
                  className="min-[1100px]:hidden"
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
                        aria-current={
                          isActive(pathname, item.href) ? "page" : undefined
                        }
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
                <SheetClose render={<LiveStreamLink mobile />} />
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
