"use client";

import * as React from "react";
import { CalendarX2 } from "lucide-react";

import type { Match, Player, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { getPlayers } from "@/lib/repository/playerRepository";
import { groupMatches, hasGroups } from "@/lib/groups";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { MatchCard } from "@/components/fixtures/match-card";
import { WeekSelector } from "@/components/fixtures/week-selector";

/** Maç kartlarını ızgara halinde gösterir. */
function MatchGrid({
  matches,
  teamMap,
  players,
}: {
  matches: Match[];
  teamMap: Map<string, Team>;
  players: Player[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((match) => {
        const homeTeam = teamMap.get(match.homeTeamId);
        const awayTeam = teamMap.get(match.awayTeamId);
        if (!homeTeam || !awayTeam) return null;
        return (
          <MatchCard
            key={match.id}
            match={match}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            players={players}
          />
        );
      })}
    </div>
  );
}

interface FixtureData {
  teams: Team[];
  matches: Match[];
  players: Player[];
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
    const [teams, matches, players] = await Promise.all([
      getTeams(),
      getMatches(),
      getPlayers(),
    ]);
    return { teams, matches, players };
  }, []);

  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = React.useState("");

  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const players = React.useMemo(() => data?.players ?? [], [data]);
  const teamMap = React.useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  );
  const weeks = React.useMemo(
    () => [...new Set(matches.map((m) => m.week))].sort((a, b) => a - b),
    [matches],
  );

  const activeWeek = selectedWeek ?? getDefaultWeek(matches);

  // Takım seçiliyse o takımın tüm maçları (haftaya göre), değilse aktif hafta.
  const displayMatches = React.useMemo(() => {
    if (selectedTeamId) {
      return matches
        .filter(
          (m) =>
            m.homeTeamId === selectedTeamId || m.awayTeamId === selectedTeamId,
        )
        .sort((a, b) => a.week - b.week || a.time.localeCompare(b.time));
    }
    return matches
      .filter((m) => m.week === activeWeek)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [matches, selectedTeamId, activeWeek]);

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
            {/* Filtreler */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                {selectedTeamId ? (
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {teamMap.get(selectedTeamId)?.name}
                    </span>{" "}
                    takımının tüm maçları
                  </span>
                ) : null}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Takım:</span>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Tüm takımlar</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {!selectedTeamId ? (
              <WeekSelector
                weeks={weeks}
                value={activeWeek}
                onChange={setSelectedWeek}
              />
            ) : null}

            {displayMatches.length === 0 ? (
              <EmptyState
                icon={<CalendarX2 className="size-6" />}
                title="Maç bulunamadı"
                description="Bu seçime uygun maç yok. Farklı bir hafta veya takım deneyin."
              />
            ) : selectedTeamId || !hasGroups(teams) ? (
              <MatchGrid
                matches={displayMatches}
                teamMap={teamMap}
                players={players}
              />
            ) : (
              <div className="space-y-8">
                {groupMatches(displayMatches, teams).map((bucket) => (
                  <div key={bucket.key} className="space-y-3">
                    {bucket.label ? (
                      <h2 className="font-heading text-lg font-semibold tracking-tight">
                        {bucket.label}
                      </h2>
                    ) : null}
                    <MatchGrid
                      matches={bucket.matches}
                      teamMap={teamMap}
                      players={players}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
