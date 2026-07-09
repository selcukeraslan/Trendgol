import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BlogPost } from "@/types";
import { Section } from "@/components/common/section";
import { BlogCard } from "@/components/blog/blog-card";

interface BlogPreviewProps {
  posts: BlogPost[];
}

/**
 * Ana sayfa blog önizlemesi. Yayınlanmış yazı yoksa hiçbir şey render etmez
 * (sayfa olduğu gibi kalır); yazı varsa yatay kaydırılabilir bir vitrin gösterir.
 */
export function BlogPreview({ posts }: BlogPreviewProps) {
  const items = posts.slice(0, 10);
  if (items.length === 0) return null;

  return (
    <Section>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Blog
          </h2>
          <p className="mt-1 text-muted-foreground">
            Ligden son haberler ve yazılar.
          </p>
        </div>
        <Link
          href="/blog"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:flex"
        >
          Tüm yazılar
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Yatay kaydırılabilir vitrin */}
      <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
          {items.map((post) => (
            <li
              key={post.id}
              className="grid w-[280px] shrink-0 snap-start sm:w-[320px]"
            >
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/blog"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline sm:hidden"
      >
        Tüm yazılar
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Section>
  );
}
