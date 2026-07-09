"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import type { BlogPost } from "@/types";
import { blogSchema, type BlogFormValues } from "@/schemas/blog";
import { useBlogStore, type BlogInput } from "@/store/blogStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/common/image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { BlogContent } from "@/components/blog/blog-content";
import { cn } from "@/lib/utils";

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDefaults(post?: BlogPost): BlogFormValues {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "Haberler",
    author: post?.author ?? "Lig Yönetimi",
    coverImageUrl: post?.coverImageUrl ?? "",
    featured: post?.featured ?? false,
    published: post?.published ?? true,
  };
}

export default function AdminBlogEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const isNew = id === "new";

  const load = useBlogStore((s) => s.load);
  const loaded = useBlogStore((s) => s.loaded);
  const posts = useBlogStore((s) => s.items);
  const add = useBlogStore((s) => s.add);
  const edit = useBlogStore((s) => s.edit);

  React.useEffect(() => {
    void load();
  }, [load]);

  const post = isNew ? undefined : posts.find((p) => p.id === id);

  // İçerik alanı için yaz/önizle modu.
  const [contentPreview, setContentPreview] = React.useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: toDefaults(post),
  });

  React.useEffect(() => {
    if (!isNew && post) form.reset(toDefaults(post));
  }, [post, isNew, form]);

  async function onSubmit(values: BlogFormValues) {
    const input: BlogInput = {
      ...values,
      coverImageUrl: values.coverImageUrl ?? "",
      publishedAt: post?.publishedAt ?? new Date().toISOString(),
    };
    if (isNew) {
      await add(input);
      toast.success("Yazı oluşturuldu.");
    } else if (post) {
      await edit(post.id, input);
      toast.success("Yazı güncellendi.");
    }
    router.push("/admin/blog");
  }

  // Düzenleme modunda yazı henüz yüklenmediyse iskelet göster.
  if (!isNew && !loaded) {
    return <LoadingSkeleton count={8} />;
  }

  if (!isNew && loaded && !post) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Yazı bulunamadı.</p>
        <Link href="/admin/blog" className="text-sm font-medium text-brand">
          Blog yönetimine dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Blog Yönetimi
      </Link>

      <h1 className="font-heading text-2xl font-bold tracking-tight">
        {isNew ? "Yeni Yazı" : "Yazıyı Düzenle"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Başlık</FormLabel>
                <FormControl>
                  <Input placeholder="Yazı başlığı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="yazi-url-adresi" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.setValue("slug", slugify(form.getValues("title")), {
                        shouldValidate: true,
                      })
                    }
                  >
                    Üret
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Input placeholder="Haberler" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yazar</FormLabel>
                  <FormControl>
                    <Input placeholder="Yazar adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kapak Görseli (opsiyonel)</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="blog"
                    alt="Kapak görseli önizleme"
                    previewClassName="h-40"
                    aspect={16 / 9}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Özet</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Kısa özet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="mb-0">İçerik</FormLabel>
                  <div className="flex rounded-md border border-border p-0.5 text-xs">
                    <button
                      type="button"
                      aria-pressed={!contentPreview}
                      onClick={() => setContentPreview(false)}
                      className={cn(
                        "rounded px-2.5 py-1 font-medium transition-colors",
                        !contentPreview
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Yaz
                    </button>
                    <button
                      type="button"
                      aria-pressed={contentPreview}
                      onClick={() => setContentPreview(true)}
                      className={cn(
                        "rounded px-2.5 py-1 font-medium transition-colors",
                        contentPreview
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Önizle
                    </button>
                  </div>
                </div>
                {contentPreview ? (
                  <div className="min-h-[16rem] rounded-lg border border-border bg-card p-4">
                    {field.value?.trim() ? (
                      <BlogContent content={field.value} />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Önizlenecek içerik yok.
                      </p>
                    )}
                  </div>
                ) : (
                  <FormControl>
                    <Textarea
                      rows={10}
                      placeholder="Yazı içeriği... (paragrafları yeni satırla ayırın)"
                      {...field}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="mb-0">Öne Çıkan</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel className="mb-0">Yayında</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              {isNew ? "Yayınla" : "Kaydet"}
            </Button>
            <Link href="/admin/blog">
              <Button type="button" variant="outline">
                Vazgeç
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
