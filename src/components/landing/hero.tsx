import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BlogPost, SiteSettings } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { HeroAnnouncements } from "@/components/landing/hero-announcements";

interface HeroProps {
  settings?: SiteSettings;
  /** Hero içindeki duyuru slider'ında gösterilecek yayınlanmış yazılar. */
  posts?: BlogPost[];
}

export function Hero({ settings, posts = [] }: HeroProps) {
  const title = settings?.heroTitle ?? "Sahanın Şampiyonu Sen Ol";
  const subtitle =
    settings?.heroSubtitle ??
    "Ücretli katılımlı, para ödüllü halı saha ligi. Takımını kur, sahaya çık, ödülü kap.";

  // Öne çıkan yazılar önce; ardından diğerleri (mevcut sıralama korunur).
  const orderedPosts = [
    ...posts.filter((p) => p.featured),
    ...posts.filter((p) => !p.featured),
  ];
  const hasPosts = orderedPosts.length > 0;

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-[#0c2622] text-white">
      {/* Arka plan efektleri */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#125e57]/45 via-[#0c2622] to-[#081c19]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-[#0fb8a9]/20 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div
          className={cn(
            "grid items-center gap-10 lg:gap-12",
            hasPosts && "lg:grid-cols-2",
          )}
        >
          {/* Metin kolonu */}
          <div
            className={cn(
              "text-center",
              hasPosts ? "lg:text-left" : "mx-auto max-w-3xl",
            )}
          >
            <h1
              className={cn(
                "font-heading text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl",
                hasPosts ? "max-w-xl" : "mx-auto max-w-3xl",
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "mt-5 text-pretty text-lg text-[#bfe0db]",
                hasPosts ? "max-w-xl" : "mx-auto max-w-xl",
              )}
            >
              {subtitle}
            </p>

            <div
              className={cn(
                "mt-8 flex flex-wrap items-center gap-3",
                hasPosts ? "justify-center lg:justify-start" : "justify-center",
              )}
            >
              <Link
                href="/iletisim"
                className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
              >
                Takımını Kaydet
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/fikstur"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Fikstürü Gör
              </Link>
            </div>
          </div>

          {/* Duyuru slider'ı */}
          {hasPosts ? <HeroAnnouncements posts={orderedPosts} /> : null}
        </div>
      </Container>
    </section>
  );
}
