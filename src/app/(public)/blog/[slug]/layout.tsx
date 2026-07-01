import type { Metadata } from "next";

import { getBlogPostBySlug } from "@/lib/repository/blogRepository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
