"use client";

import * as React from "react";
import { Newspaper } from "lucide-react";

import type { BlogPost } from "@/types";
import { getPublishedBlogPosts } from "@/lib/repository/blogRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { BlogCard } from "@/components/blog/blog-card";

const ALL = "Tümü";

export default function BlogPage() {
  const { data, loading, error } = useAsyncData<BlogPost[]>(
    () => getPublishedBlogPosts(),
    [],
  );
  const [category, setCategory] = React.useState(ALL);

  const posts = React.useMemo(() => data ?? [], [data]);
  const categories = React.useMemo(
    () => [ALL, ...new Set(posts.map((post) => post.category))],
    [posts],
  );

  const featured = posts.filter((post) => post.featured);
  const filtered =
    category === ALL
      ? posts
      : posts.filter((post) => post.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Haberler & İçerikler"
        title="Blog"
        description="Lig haberleri, maç özetleri, röportajlar ve duyurular."
      />
      <Container className="space-y-10 py-10">
        {loading ? (
          <LoadingSkeleton variant="card" count={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="size-6" />}
            title="Henüz yazı yok"
            description="İlk blog yazıları yakında yayınlanacak."
          />
        ) : (
          <>
            {/* Öne çıkan */}
            {category === ALL && featured.length > 0 ? (
              <section className="space-y-4">
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  Öne Çıkanlar
                </h2>
                <div className="grid gap-5 lg:grid-cols-2">
                  {featured.slice(0, 2).map((post) => (
                    <BlogCard key={post.id} post={post} featured />
                  ))}
                </div>
              </section>
            ) : null}

            {/* Kategori filtresi */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    cat === category
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tüm yazılar */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
