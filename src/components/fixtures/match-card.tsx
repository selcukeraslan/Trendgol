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

/** Klasik siyah-beyaz futbol topu simgesi (golcü isimleri için). */
function BallIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* Merkez beşgen */}
      <path
        fill="currentColor"
        d="M12 9.3 14.57 11.17 13.59 14.18 10.41 14.18 9.43 11.17Z"
      />
      {/* Beşgen köşelerinden çembere uzanan dikişler */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        d="M12 9.3V3.5M14.57 11.17 19.8 9.47M13.59 14.18 16.82 18.63M10.41 14.18 7.18 18.63M9.43 11.17 4.2 9.47"
      />
    </svg>
  );
}

/** Küçük kart göstergesi — kırmızı(lar) sonra sarı(lar). */
function CardSquares({ yellow, red }: { yellow: number; red: number }) {
  if (yellow === 0 && red === 0) return null;
  return (
    <span className="flex shrink-0 items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: red }).map((_, i) => (
        <span key={`r${i}`} className="h-3 w-2 rounded-[1.5px] bg-destructive" />
      ))}
      {Array.from({ length: yellow }).map((_, i) => (
        <span key={`y${i}`} className="h-3 w-2 rounded-[1.5px] bg-[#f3c94d]" />
      ))}
    </span>
  );
}

interface TeamEvents {
  scorers: { name: string; goals: number }[];
  cards: { name: string; yellow: number; red: number }[];
}

/** Oynanan maçta golcü ve kart olaylarını takım bazında gösterir. */
function MatchEvents({
  match,
  players,
}: {
  match: Match;
  players?: Player[];
}) {
  if (match.status !== "played" || !players) return null;
  const scorers = match.scorers ?? [];
  const cards = match.cards ?? [];
  if (scorers.length === 0 && cards.length === 0) return null;

  const playerMap = new Map(players.map((p) => [p.id, p]));

  function buildTeam(teamId: string): TeamEvents {
    const scorerLines: { name: string; goals: number }[] = [];
    for (const s of scorers) {
      const player = playerMap.get(s.playerId);
      if (player && player.teamId === teamId) {
        scorerLines.push({ name: player.name, goals: s.goals });
      }
    }
    const cardMap = new Map<
      string,
      { name: string; yellow: number; red: number }
    >();
    for (const c of cards) {
      const player = playerMap.get(c.playerId);
      if (!player || player.teamId !== teamId) continue;
      const cur = cardMap.get(c.playerId) ?? {
        name: player.name,
        yellow: 0,
        red: 0,
      };
      if (c.type === "red") cur.red += 1;
      else cur.yellow += 1;
      cardMap.set(c.playerId, cur);
    }
    return { scorers: scorerLines, cards: [...cardMap.values()] };
  }

  const home = buildTeam(match.homeTeamId);
  const away = buildTeam(match.awayTeamId);

  const renderCol = (data: TeamEvents) => (
    <ul className="space-y-1.5 text-center text-xs">
      {data.scorers.map((s, i) => (
        <li
          key={`g${i}`}
          className="flex items-center justify-center gap-1.5 text-muted-foreground"
        >
          <BallIcon className="size-4 shrink-0 text-foreground/75" />
          <span className="font-medium text-foreground">{s.name}</span>
          {s.goals > 1 ? (
            <span className="text-muted-foreground">×{s.goals}</span>
          ) : null}
        </li>
      ))}
      {data.cards.map((c, i) => (
        <li
          key={`c${i}`}
          className="flex items-center justify-center gap-1.5 text-muted-foreground"
        >
          <CardSquares yellow={c.yellow} red={c.red} />
          <span className="font-medium text-foreground">{c.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-4 grid grid-cols-2 gap-6 border-t border-border/60 pt-3 sm:gap-10">
      {renderCol(home)}
      {renderCol(away)}
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

      <MatchEvents match={match} players={players} />

      {match.date || match.time || match.venue ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {match.date ? (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatShortDate(match.date)}
            </span>
          ) : null}
          {match.time ? (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              {match.time}
            </span>
          ) : null}
          {match.venue ? (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {match.venue}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
