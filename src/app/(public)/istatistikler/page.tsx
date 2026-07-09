"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";

import type { Match, Player, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { getPlayers } from "@/lib/repository/playerRepository";
import { calculateTopScorers } from "@/lib/scorers";
import { calculatePlayerCards } from "@/lib/stats";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { TopScorersTable } from "@/components/standings/top-scorers-table";
import { CardsTable } from "@/components/standings/cards-table";

interface StatsData {
  teams: Team[];
  players: Player[];
  matches: Match[];
}

export default function StatsPage() {
  const { data, loading, error } = useAsyncData<StatsData>(async () => {
    const [teams, players, matches] = await Promise.all([
      getTeams(),
      getPlayers(),
      getMatches(),
    ]);
    return { teams, players, matches };
  }, []);

  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const players = React.useMemo(() => data?.players ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const [selectedTeamId, setSelectedTeamId] = React.useState("");

  const scorers = React.useMemo(
    () => calculateTopScorers(players, teams, matches),
    [players, teams, matches],
  );
  const cards = React.useMemo(
    () => calculatePlayerCards(players, teams, matches),
    [players, teams, matches],
  );

  const hasAny = scorers.length > 0 || cards.length > 0;

  const filteredScorers = selectedTeamId
    ? scorers.filter((s) => s.teamId === selectedTeamId)
    : scorers;
  const filteredCards = selectedTeamId
    ? cards.filter((c) => c.teamId === selectedTeamId)
    : cards;

  return (
    <>
      <PageHeader
        eyebrow="Sezon 2026"
        title="İstatistikler"
        description="Gol krallığı ve kart istatistikleri, oynanan maçlardan otomatik hesaplanır."
      />
      <Container className="py-10">
        {loading ? (
          <LoadingSkeleton variant="row" count={8} />
        ) : error ? (
          <ErrorState message={error} />
        ) : !hasAny ? (
          <EmptyState
            icon={<BarChart3 className="size-6" />}
            title="Henüz istatistik yok"
            description="Maçlar oynandıkça gol ve kart istatistikleri burada görünecek."
          />
        ) : (
          <div className="space-y-10">
            {/* Takım filtresi */}
            <div className="flex justify-end">
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

            <section>
              <h2 className="mb-4 font-heading text-xl font-bold tracking-tight sm:text-2xl">
                Gol Krallığı
              </h2>
              {filteredScorers.length > 0 ? (
                <TopScorersTable scorers={filteredScorers} highlight={3} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedTeamId
                    ? "Bu takımdan gol kaydı yok."
                    : "Henüz gol kaydı yok."}
                </p>
              )}
            </section>

            <section>
              <h2 className="mb-4 font-heading text-xl font-bold tracking-tight sm:text-2xl">
                Kartlar
              </h2>
              {filteredCards.length > 0 ? (
                <CardsTable cards={filteredCards} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedTeamId
                    ? "Bu takımdan kart kaydı yok."
                    : "Henüz kart kaydı yok."}
                </p>
              )}
            </section>
          </div>
        )}
      </Container>
    </>
  );
}
