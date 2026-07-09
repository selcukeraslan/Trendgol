import { cn } from "@/lib/utils";
import type { Team } from "@/types";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("tr");
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-lg",
} as const;

interface TeamLogoProps {
  team: Pick<Team, "name" | "color" | "logoUrl">;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/** Takım logosu; görsel yoksa renk + baş harf rozetine düşer. */
export function TeamLogo({ team, size = "md", className }: TeamLogoProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-heading font-bold text-white shadow-sm ring-1 ring-white/10",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: team.color || "#475569" }}
      aria-hidden="true"
    >
      {team.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={team.logoUrl}
          alt=""
          className="size-full rounded-full object-cover"
        />
      ) : (
        getInitials(team.name) || "?"
      )}
    </span>
  );
}
