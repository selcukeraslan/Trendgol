import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/common/container";

export function CtaSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-card to-card p-10 text-center sm:p-14">
          <div
            className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/20 blur-3xl"
            aria-hidden="true"
          />
          <h2 className="relative font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Şampiyonluk yolundaki yerini al
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
            Kontenjanlar dolmadan takımını kaydet, ligin bir parçası ol.
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
        </div>
      </Container>
    </section>
  );
}
