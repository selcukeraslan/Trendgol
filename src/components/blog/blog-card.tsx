import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { formatBlogDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
  /** Öne çıkan yazı için daha büyük görünüm. */
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg",
        featured && "sm:flex-row",
      )}
    >
      {/* Kapak (placeholder gradient) */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center bg-gradient-to-br from-brand/20 via-muted to-background",
          featured ? "aspect-video sm:aspect-auto sm:w-1/2" : "aspect-video",
        )}
      >
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="size-full object-cover"
          />
        ) : (
          <span className="font-heading text-4xl font-bold text-brand/30">
            HS
          </span>
        )}
        <Badge className="absolute left-3 top-3" variant="secondary">
          {post.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className={cn(
            "font-heading font-bold tracking-tight transition-colors group-hover:text-brand",
            featured ? "text-2xl" : "text-lg",
          )}
        >
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3.5" aria-hidden="true" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatBlogDate(post.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
