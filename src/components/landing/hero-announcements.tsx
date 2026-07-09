"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { formatBlogDate } from "@/lib/date";
import { buttonVariants } from "@/components/ui/button";

interface HeroAnnouncementsProps {
  posts: BlogPost[];
}

/**
 * Hero içindeki duyuru/blog slider'ı. Öne çıkan yazılar kapak görseliyle
 * birlikte, ileri/geri kaydırılabilir biçimde gösterilir. Yazı yoksa null döner.
 */
export function HeroAnnouncements({ posts }: HeroAnnouncementsProps) {
  const items = React.useMemo(() => posts.slice(0, 6), [posts]);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const active = items[index];
  const many = items.length > 1;

  const go = React.useCallback(
    (dir: number) =>
      setIndex((i) => (i + dir + items.length) % items.length),
    [items.length],
  );

  // Bir süre sonra otomatik geçiş. Hover'da durur, hareket azaltma tercihinde
  // hiç çalışmaz; index değişince süre yeniden başlar (manuel geçiş resetler).
  React.useEffect(() => {
    if (!many || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [many, paused, items.length, index]);

  if (!active) return null;

  return (
    <div className="w-full">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur"
      >
        {/* Kapak görseli */}
        <div className="relative aspect-video">
          {active.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={active.id}
              src={active.coverImageUrl}
              alt={active.title}
              className="size-full object-cover duration-500 animate-in fade-in slide-in-from-right-4"
            />
          ) : (
            <div
              key={active.id}
              className="flex size-full items-center justify-center bg-gradient-to-br from-[#125e57]/60 via-[#0c2622] to-[#081c19] duration-500 animate-in fade-in slide-in-from-right-4"
            >
              <span className="font-heading text-5xl font-bold text-white/15">
                TG
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {active.category}
          </span>

          {many ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Önceki duyuru"
                className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Sonraki duyuru"
                className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>

        {/* İçerik */}
        <div key={active.id} className="p-5 text-left duration-500 animate-in fade-in sm:p-6">
          <p className="text-xs font-medium text-[#8fbab3]">
            {formatBlogDate(active.publishedAt)}
          </p>
          <h3 className="mt-2 line-clamp-2 font-heading text-xl font-bold tracking-tight text-white">
            {active.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-[#bfe0db]">
            {active.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Link
              href={`/blog/${active.slug}`}
              className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
            >
              Yazıyı oku
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            {many ? (
              <div className="flex items-center gap-1.5">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${i + 1}. duyuruya git`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index
                        ? "w-5 bg-[#0fb8a9]"
                        : "w-1.5 bg-white/25 hover:bg-white/40",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
