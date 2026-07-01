"use client";

import * as React from "react";
import { CalendarX2 } from "lucide-react";

import type { Match, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { MatchCard } from "@/components/fixtures/match-card";
import { WeekSelector } from "@/components/fixtures/week-selector";

interface FixtureData {
  teams: Team[];
  matches: Match[];
}

function getDefaultWeek(matches: Match[]): number {
  const weeks = [...new Set(matches.map((m) => m.week))].sort((a, b) => a - b);
  const upcoming = weeks.find((week) =>
    matches.some((m) => m.week === week && m.status !== "played"),
  );
  return upcoming ?? weeks[0] ?? 1;
}

export default function FixturePage() {
  const { data, loading, error } = useAsyncData<FixtureData>(async () => {
    const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
    return { teams, matches };
  }, []);

  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(null);

  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const teamMap = React.useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  );
  const weeks = React.useMemo(
    () => [...new Set(matches.map((m) => m.week))].sort((a, b) => a - b),
    [matches],
  );

  const activeWeek = selectedWeek ?? getDefaultWeek(matches);
  const weekMatches = matches
    .filter((m) => m.week === activeWeek)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      <PageHeader
        eyebrow="Sezon 2026"
        title="Fikstür"
        description="Haftalara göre maç programı, skorlar ve saha bilgileri."
      />
      <Container className="py-10">
        {loading ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : weeks.length === 0 ? (
          <EmptyState
            icon={<CalendarX2 className="size-6" />}
            title="Henüz maç eklenmedi"
            description="Fikstür yakında yayınlanacak. Takipte kalın!"
          />
        ) : (
          <div className="space-y-6">
            <WeekSelector
              weeks={weeks}
              value={activeWeek}
              onChange={setSelectedWeek}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {weekMatches.map((match) => {
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
          </div>
        )}
      </Container>
    </>
  );
}
