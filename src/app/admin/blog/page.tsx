"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { BlogPost } from "@/types";
import { formatShortDate } from "@/lib/date";
import { useBlogStore } from "@/store/blogStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function AdminBlogPage() {
  const load = useBlogStore((s) => s.load);
  const posts = useBlogStore((s) => s.items);
  const loaded = useBlogStore((s) => s.loaded);
  const edit = useBlogStore((s) => s.edit);
  const remove = useBlogStore((s) => s.remove);

  React.useEffect(() => {
    void load();
  }, [load]);

  const sorted = React.useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [posts],
  );

  async function handleTogglePublish(post: BlogPost, value: boolean) {
    await edit(post.id, { published: value });
    toast.success(value ? "Yazı yayına alındı." : "Yazı pasife alındı.");
  }

  async function handleDelete(post: BlogPost) {
    await remove(post.id);
    toast.success("Yazı silindi.");
  }

  const columns: DataTableColumn<BlogPost>[] = [
    {
      header: "Başlık",
      cell: (post) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{post.title}</span>
          {post.featured ? (
            <Badge variant="secondary" className="shrink-0">
              Öne çıkan
            </Badge>
          ) : null}
        </div>
      ),
    },
    { header: "Kategori", cell: (post) => post.category },
    { header: "Tarih", cell: (post) => formatShortDate(post.publishedAt) },
    {
      header: "Yayında",
      className: "text-center",
      cell: (post) => (
        <Switch
          checked={post.published}
          onCheckedChange={(value) => handleTogglePublish(post, value)}
          aria-label="Yayın durumu"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Blog Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground">
            Yazı ekleyin, düzenleyin ve yayın durumunu yönetin.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      {!loaded ? (
        <LoadingSkeleton variant="row" count={6} />
      ) : (
        <DataTable
          columns={columns}
          rows={sorted}
          rowKey={(post) => post.id}
          getSearchText={(post) => `${post.title} ${post.category}`}
          searchPlaceholder="Yazı ara..."
          emptyTitle="Henüz yazı yok"
          emptyDescription="İlk yazıyı eklemek için 'Yeni Yazı' butonunu kullanın."
          actions={(post) => (
            <div className="flex items-center justify-end gap-1">
              <Link href={`/admin/blog/${post.id}`}>
                <Button variant="ghost" size="sm" aria-label="Düzenle">
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
              </Link>
              <DeleteConfirmDialog
                title={`"${post.title}" silinsin mi?`}
                onConfirm={() => handleDelete(post)}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    aria-label="Sil"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
            </div>
          )}
        />
      )}
    </div>
  );
}
