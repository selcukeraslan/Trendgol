import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Match, Team } from "@/types";
import { Section } from "@/components/common/section";
import { MatchCard } from "@/components/fixtures/match-card";

interface UpcomingMatchesProps {
  matches: Match[];
  teams: Team[];
}

export function UpcomingMatches({ matches, teams }: UpcomingMatchesProps) {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const upcoming = matches
    .filter((m) => m.status === "scheduled")
    .sort(
      (a, b) =>
        (a.date ? new Date(a.date).getTime() : Infinity) -
        (b.date ? new Date(b.date).getTime() : Infinity),
    )
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <Section>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Yaklaşan Maçlar
          </h2>
          <p className="mt-1 text-muted-foreground">
            Bir sonraki haftanın öne çıkan karşılaşmaları.
          </p>
        </div>
        <Link
          href="/fikstur"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:flex"
        >
          Tüm fikstür
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((match) => {
          const homeTeam = teamMap.get(match.homeTeamId);
          const awayTeam = teamMap.get(match.awayTeamId);
          if (!homeTeam || !awayTeam) return null;
          return (
            <MatchCard
              key={match.id}
              match={match}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
          );
        })}
      </div>
    </Section>
  );
}
