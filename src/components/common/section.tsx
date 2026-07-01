import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";

interface SectionProps extends React.ComponentProps<"section"> {
  /** İçeriği otomatik Container ile sarmalar (varsayılan: true). */
  contained?: boolean;
}

/** Dikey boşluk veren bölüm sarmalayıcısı. */
export function Section({
  className,
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-20", className)} {...props}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
