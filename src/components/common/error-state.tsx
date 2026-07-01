import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";

/** Veri yüklenemediğinde gösterilen hata durumu. */
export function ErrorState({ message }: { message?: string }) {
  return (
    <EmptyState
      icon={<AlertTriangle className="size-6 text-destructive" />}
      title="Bir hata oluştu"
      description={
        message ??
        "Veriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin."
      }
    />
  );
}
