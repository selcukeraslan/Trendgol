import type { BlogPost } from "@/types";
import blogSeed from "@/data/blog.json";
import { createCollection } from "./base";

const collection = createCollection<BlogPost>(
  "blog",
  blogSeed as unknown as BlogPost[],
  "b",
);

/** Tüm blog yazıları (taslaklar dahil) — admin için. */
export const getBlogPosts = collection.getAll;
export const getBlogPostById = collection.getById;
export const createBlogPost = collection.create;
export const updateBlogPost = collection.update;
export const deleteBlogPost = collection.remove;

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Yalnızca yayında olan yazılar — public için, tarihe göre yeniden eskiye. */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const all = await collection.getAll();
  return sortByDateDesc(all.filter((post) => post.published));
}

/** Slug ile yayında olan yazıyı döner. */
export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const all = await collection.getAll();
  return all.find((post) => post.slug === slug && post.published) ?? null;
}
