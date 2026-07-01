"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import type { BlogPost } from "@/types";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/repository/blogRepository";
import { formatBlogDate } from "@/lib/date";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { BlogContent } from "@/components/blog/blog-content";
import { RelatedPosts } from "@/components/blog/related-posts";

interface BlogDetailData {
  post: BlogPost | null;
  posts: BlogPost[];
}

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data, loading } = useAsyncData<BlogDetailData>(async () => {
    const [post, posts] = await Promise.all([
      getBlogPostBySlug(slug),
      getPublishedBlogPosts(),
    ]);
    return { post, posts };
  }, [slug]);

  if (loading) {
    return (
      <Container className="max-w-3xl py-10">
        <LoadingSkeleton count={8} />
      </Container>
    );
  }

  const post = data?.post ?? null;

  if (!post) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Yazı bulunamadı"
          description="Aradığınız yazı yayından kaldırılmış veya hiç var olmamış olabilir."
          action={
            <Link href="/blog" className="text-sm font-medium text-brand">
              Bloga dön
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <article>
      <Container className="max-w-3xl py-10">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Blog
        </Link>

        <Badge variant="secondary" className="mb-4">
          {post.category}
        </Badge>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-4" aria-hidden="true" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatBlogDate(post.publishedAt)}
          </span>
        </div>

        {/* Kapak (placeholder) */}
        <div className="mt-8 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand/20 via-muted to-background">
          {post.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="size-full object-cover"
            />
          ) : (
            <span className="font-heading text-5xl font-bold text-brand/30">
              HS
            </span>
          )}
        </div>

        <div className="mt-8">
          <BlogContent content={post.content} />
        </div>
      </Container>

      <Container className="max-w-5xl pb-14">
        <RelatedPosts current={post} posts={data?.posts ?? []} />
      </Container>
    </article>
  );
}
