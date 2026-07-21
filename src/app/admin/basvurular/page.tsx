"use client";

import * as React from "react";
import { Eye, Mail, Phone } from "lucide-react";

import {
  getContactMessages,
  type ContactMessageRecord,
} from "@/lib/repository/contactRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export default function AdminApplicationsPage() {
  const [selected, setSelected] = React.useState<ContactMessageRecord | null>(
    null,
  );
  const { data, loading, error } = useAsyncData<ContactMessageRecord[]>(
    getContactMessages,
    [],
  );

  const messages = data ?? [];
  const columns: DataTableColumn<ContactMessageRecord>[] = [
    {
      header: "Başvuran",
      cell: (message) => (
        <div>
          <div className="font-medium">{message.name}</div>
          <a
            href={`mailto:${message.email}`}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            {message.email}
          </a>
        </div>
      ),
    },
    {
      header: "Telefon",
      cell: (message) =>
        message.phone ? (
          <a
            href={`tel:${message.phone}`}
            className="hover:text-foreground hover:underline"
          >
            {message.phone}
          </a>
        ) : (
          "—"
        ),
    },
    {
      header: "Takım",
      cell: (message) => message.teamName || "—",
    },
    {
      header: "Mesaj",
      className: "max-w-72",
      cell: (message) => (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {message.message}
        </p>
      ),
    },
    {
      header: "Tarih",
      className: "whitespace-nowrap",
      cell: (message) => formatCreatedAt(message.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Başvurular
        </h1>
        <p className="text-sm text-muted-foreground">
          İletişim formundan gönderilen takım başvurularını ve mesajları
          görüntüleyin.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <LoadingSkeleton variant="row" count={6} />
      ) : (
        <DataTable
          columns={columns}
          rows={messages}
          rowKey={(message) => message.id}
          getSearchText={(message) =>
            `${message.name} ${message.email} ${message.phone ?? ""} ${message.teamName ?? ""} ${message.message}`
          }
          searchPlaceholder="Başvuru ara..."
          emptyTitle="Henüz başvuru yok"
          emptyDescription="İletişim formundan gelen başvurular burada görüntülenecek."
          actions={(message) => (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelected(message)}
            >
              <Eye className="size-4" aria-hidden="true" />
              Görüntüle
            </Button>
          )}
        />
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selected?.name ?? "Başvuru Detayı"}</DialogTitle>
            <DialogDescription>
              {selected ? formatCreatedAt(selected.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-5">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50"
                >
                  <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="min-w-0 break-all">{selected.email}</span>
                </a>
                {selected.phone ? (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50"
                  >
                    <Phone
                      className="size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    {selected.phone}
                  </a>
                ) : null}
              </div>

              {selected.teamName ? (
                <div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Takım Adı
                  </div>
                  <div className="mt-1 font-medium">{selected.teamName}</div>
                </div>
              ) : null}

              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Mesaj
                </div>
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted/40 p-4 text-sm leading-relaxed">
                  {selected.message}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
