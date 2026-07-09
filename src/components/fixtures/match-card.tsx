import { CalendarDays, Clock, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Match, Player, Team } from "@/types";
import { formatShortDate } from "@/lib/date";
import { TeamLogo } from "@/components/teams/team-logo";
import { StatusBadge } from "@/components/fixtures/status-badge";

interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  /** Golcü isimlerini çözmek için. Verilmezse oynanan maçta golcü listesi gizlenir. */
  players?: Player[];
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
    </div>
  );
}

/** Soft futbol topu simgesi (golcü isimleri için). */
function BallIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5 14.6 9.4 13.6 12.5 10.4 12.5 9.4 9.4Z" />
      <path d="M12 7.5V4.5M14.6 9.4l2.7-1M13.6 12.5l1.8 2.4M10.4 12.5l-1.8 2.4M9.4 9.4l-2.7-1" />
    </svg>
  );
}

/** Oynanan maçta hangi takımdan kimin gol attığını gösterir. */
function MatchScorers({
  match,
  players,
}: {
  match: Match;
  players?: Player[];
}) {
  if (match.status !== "played" || !match.scorers?.length || !players) {
    return null;
  }

  const playerMap = new Map(players.map((p) => [p.id, p]));
  const home: { name: string; goals: number }[] = [];
  const away: { name: string; goals: number }[] = [];

  for (const scorer of match.scorers) {
    const player = playerMap.get(scorer.playerId);
    if (!player) continue;
    const entry = { name: player.name, goals: scorer.goals };
    if (player.teamId === match.homeTeamId) home.push(entry);
    else if (player.teamId === match.awayTeamId) away.push(entry);
  }

  if (home.length === 0 && away.length === 0) return null;

  const renderList = (list: { name: string; goals: number }[]) => (
    <ul className="space-y-1.5 text-center text-xs">
      {list.map((s, i) => (
        <li
          key={i}
          className="flex items-center justify-center gap-1.5 text-muted-foreground"
        >
          <BallIcon className="size-3.5 shrink-0 text-muted-foreground/70" />
          <span className="font-medium text-foreground">{s.name}</span>
          {s.goals > 1 ? (
            <span className="text-muted-foreground">×{s.goals}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-4 grid grid-cols-2 gap-6 border-t border-border/60 pt-3 sm:gap-10">
      {renderList(home)}
      {renderList(away)}
    </div>
  );
}

/** Tek bir maçı gösteren kart (fikstür ve yaklaşan maçlar). */
export function MatchCard({
  match,
  homeTeam,
  awayTeam,
  players,
  className,
}: MatchCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40 sm:p-5",
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

      <MatchScorers match={match} players={players} />

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
    </div>
  );
}
