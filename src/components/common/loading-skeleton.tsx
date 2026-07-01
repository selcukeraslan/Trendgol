import * as React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonVariant = "text" | "card" | "row";

interface LoadingSkeletonProps {
  /** Gösterilecek iskelet öğe sayısı. */
  count?: number;
  variant?: SkeletonVariant;
  className?: string;
}

/** Veri yüklenirken gösterilen iskelet (skeleton) bileşeni. */
export function LoadingSkeleton({
  count = 3,
  variant = "text",
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "card") {
    return (
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {items.map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-border bg-card p-5"
          >
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}
