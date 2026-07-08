import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Match, Team } from "@/types";
import { formatShortDate } from "@/lib/date";
import { TeamLogo } from "@/components/teams/team-logo";
import { StatusBadge } from "@/components/fixtures/status-badge";

interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  className?: string;
}

function MatchScore({ match }: { match: Match }) {
  if (match.status === "played") {
    return (
      <div className="font-heading text-2xl font-bold tabular-nums sm:text-3xl">
        {match.homeScore}
        <span className="mx-1.5 text-muted-foreground">-</span>
        {match.awayScore}
      </div>
    );
  }

  if (match.status === "postponed") {
    return <div className="font-heading text-xl text-muted-foreground">—</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-1 font-heading text-xl font-bold tabular-nums">
        <Clock className="size-4 text-brand" aria-hidden="true" />
        {match.time}
      </span>
      <span className="text-xs text-muted-foreground">karşı karşıya</span>
    </div>
  );
}

/** Tek bir maçı gösteren kart (fikstür ve yaklaşan maçlar). */
export function MatchCard({
  match,
  homeTeam,
  awayTeam,
  className,
}: MatchCardProps) {
  return (
    <Link
      href={`/mac/${match.id}`}
      className={cn(
        "block rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40 focus-visible:border-brand/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {match.week}. Hafta
        </span>
        <StatusBadge status={match.status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        {/* Ev sahibi */}
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-end sm:text-right">
          <span className="order-2 line-clamp-2 text-sm font-medium sm:order-1">
            {homeTeam.name}
          </span>
          <TeamLogo team={homeTeam} size="md" className="order-1 sm:order-2" />
        </div>

        {/* Skor / saat */}
        <div className="flex min-w-16 justify-center text-center">
          <MatchScore match={match} />
        </div>

        {/* Deplasman */}
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-start sm:text-left">
          <TeamLogo team={awayTeam} size="md" />
          <span className="line-clamp-2 text-sm font-medium">
            {awayTeam.name}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatShortDate(match.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" />
          {match.time}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden="true" />
          {match.venue}
        </span>
      </div>
    </Link>
  );
}
