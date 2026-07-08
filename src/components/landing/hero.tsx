import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/common/container";

export function Hero({ settings }: { settings?: SiteSettings }) {
  const title = settings?.heroTitle ?? "Sahanın Şampiyonu Sen Ol";
  const subtitle =
    settings?.heroSubtitle ??
    "Takımını kur, sahaya çık, ligin zirvesine oyna.";

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Arka plan efektleri */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-brand/10 via-background to-background"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative py-20 text-center sm:py-28">
        <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/iletisim"
            className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
          >
            Takımını Kaydet
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/fikstur"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Fikstürü Gör
          </Link>
        </div>
      </Container>
    </section>
  );
}
