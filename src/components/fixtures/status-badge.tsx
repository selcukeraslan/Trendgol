import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/types";
import { matchStatusLabels } from "@/lib/labels";

const statusStyles: Record<MatchStatus, string> = {
  scheduled: "bg-sky-500/10 text-sky-500 ring-sky-500/20",
  played: "bg-brand/10 text-brand ring-brand/20",
  postponed: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
};

/** Maç durumunu renkli rozet olarak gösterir. */
export function StatusBadge({
  status,
  className,
}: {
  status: MatchStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
        className,
      )}
    >
      {matchStatusLabels[status]}
    </span>
  );
}
