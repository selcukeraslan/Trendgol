import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";

interface PageHeaderProps {
  /** Sayfa üstünde görünen küçük etiket (opsiyonel). */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Sağ tarafta gösterilecek aksiyonlar (buton vb.). */
  actions?: React.ReactNode;
  className?: string;
}

/** Public sayfa başlıkları için ortak başlık alanı. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-border/60 bg-gradient-to-b from-muted/40 to-background py-10 sm:py-14",
        className,
      )}
    >
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          {eyebrow ? (
            <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium tracking-wide text-brand uppercase">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-pretty text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        ) : null}
      </Container>
    </div>
  );
}
