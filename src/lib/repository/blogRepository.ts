import type { BlogPost } from "@/types";
import { getSupabase } from "@/lib/supabase/client";

const TABLE = "blog_posts";

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  author: string;
  published_at: string;
  featured: boolean;
  published: boolean;
}

function fromRow(r: BlogRow): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    coverImageUrl: r.cover_image_url ?? undefined,
    category: r.category,
    author: r.author,
    publishedAt: r.published_at,
    featured: r.featured,
    published: r.published,
  };
}

function toRow(input: Partial<Omit<BlogPost, "id">>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.title !== undefined) patch.title = input.title;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.content !== undefined) patch.content = input.content;
  if (input.coverImageUrl !== undefined)
    patch.cover_image_url = input.coverImageUrl || null;
  if (input.category !== undefined) patch.category = input.category;
  if (input.author !== undefined) patch.author = input.author;
  if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;
  if (input.featured !== undefined) patch.featured = input.featured;
  if (input.published !== undefined) patch.published = input.published;
  return patch;
}

/** Tüm blog yazıları (taslaklar dahil) — admin için. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BlogRow[]).map(fromRow);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as BlogRow) : null;
}

export async function createBlogPost(
  input: Omit<BlogPost, "id">,
): Promise<BlogPost> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert(toRow(input))
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as BlogRow);
}

export async function updateBlogPost(
  id: string,
  input: Partial<Omit<BlogPost, "id">>,
): Promise<BlogPost> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(toRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as BlogRow);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await getSupabase().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Yalnızca yayında olan yazılar — public için, tarihe göre yeniden eskiye. */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BlogRow[]).map(fromRow);
}

/** Slug ile yayında olan yazıyı döner. */
export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as BlogRow) : null;
}
