"use client";

import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  weeks: number[];
  value: number;
  onChange: (week: number) => void;
}

/** Haftalar arasında geçiş yapan yatay seçici. */
export function WeekSelector({ weeks, value, onChange }: WeekSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {weeks.map((week) => (
        <button
          key={week}
          type="button"
          onClick={() => onChange(week)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            week === value
              ? "border-brand bg-brand text-brand-foreground"
              : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground",
          )}
        >
          {week}. Hafta
        </button>
      ))}
    </div>
  );
}
