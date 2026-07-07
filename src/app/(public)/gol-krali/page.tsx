"use client";

import * as React from "react";
import { Goal } from "lucide-react";

import type { Match, Player, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { getPlayers } from "@/lib/repository/playerRepository";
import { calculateTopScorers } from "@/lib/scorers";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { TopScorersTable } from "@/components/standings/top-scorers-table";

interface ScorersData {
  teams: Team[];
  players: Player[];
  matches: Match[];
}

export default function TopScorersPage() {
  const { data, loading, error } = useAsyncData<ScorersData>(async () => {
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
  const scorers = React.useMemo(
    () => calculateTopScorers(players, teams, matches),
    [players, teams, matches],
  );

  return (
    <>
      <PageHeader
        eyebrow="Sezon 2026"
        title="Gol Krallığı"
        description="En golcü oyuncular, oynanan maçların golcü kayıtlarından otomatik hesaplanır."
      />
      <Container className="py-10">
        {loading ? (
          <LoadingSkeleton variant="row" count={8} />
        ) : error ? (
          <ErrorState message={error} />
        ) : scorers.length === 0 ? (
          <EmptyState
            icon={<Goal className="size-6" />}
            title="Henüz gol kaydı yok"
            description="Maçlar oynandıkça gol krallığı burada görünecek."
          />
        ) : (
          <TopScorersTable scorers={scorers} highlight={3} />
        )}
      </Container>
    </>
  );
}
