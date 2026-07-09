import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";
import { DEFAULT_CTA_TEXT, DEFAULT_CTA_TITLE } from "@/lib/content-defaults";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/common/container";

export function CtaSection({ settings }: { settings?: SiteSettings }) {
  const title = settings?.ctaTitle || DEFAULT_CTA_TITLE;
  const text = settings?.ctaText || DEFAULT_CTA_TEXT;
  const rulesPdfUrl = settings?.rulesPdfUrl;

  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-card to-card p-10 text-center sm:p-14">
          <div
            className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/20 blur-3xl"
            aria-hidden="true"
          />
          <h2 className="relative font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
            {text}
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/iletisim"
              className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
            >
              Takımını Kaydet
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/iletisim"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              İletişime Geç
            </Link>
          </div>

          {rulesPdfUrl ? (
            <a
              href={rulesPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <FileText className="size-4" aria-hidden="true" />
              Kuralları İncele (PDF)
            </a>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
