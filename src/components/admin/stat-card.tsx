import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: boolean;
}

export function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            accent ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 font-heading text-3xl font-bold tabular-nums">
        {value}
      </div>
    </div>
  );
}
