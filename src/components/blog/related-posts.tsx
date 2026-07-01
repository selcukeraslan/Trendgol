import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/blog/blog-card";

interface RelatedPostsProps {
  current: BlogPost;
  posts: BlogPost[];
  limit?: number;
}

/** Aynı kategoriyi önceleyerek benzer yazıları seçer ve gösterir. */
export function RelatedPosts({
  current,
  posts,
  limit = 3,
}: RelatedPostsProps) {
  const others = posts.filter((post) => post.id !== current.id);
  const sameCategory = others.filter(
    (post) => post.category === current.category,
  );
  const rest = others.filter((post) => post.category !== current.category);
  const related = [...sameCategory, ...rest].slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-bold tracking-tight">
        Benzer Yazılar
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
