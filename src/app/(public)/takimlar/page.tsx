"use client";

import * as React from "react";
import { Users } from "lucide-react";

import type { Player, Team } from "@/types";
import { getTeams } from "@/lib/repository/teamRepository";
import { getPlayers } from "@/lib/repository/playerRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { TeamCard } from "@/components/teams/team-card";

interface TeamsData {
  teams: Team[];
  players: Player[];
}

export default function TeamsPage() {
  const { data, loading, error } = useAsyncData<TeamsData>(async () => {
    const [teams, players] = await Promise.all([getTeams(), getPlayers()]);
    return { teams, players };
  }, []);

  const teams = data?.teams ?? [];
  const players = React.useMemo(() => data?.players ?? [], [data]);

  const playerCountByTeam = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const player of players) {
      counts.set(player.teamId, (counts.get(player.teamId) ?? 0) + 1);
    }
    return counts;
  }, [players]);

  return (
    <>
      <PageHeader
        eyebrow="Lige Katılanlar"
        title="Takımlar"
        description="Ligimizde mücadele eden takımları keşfedin."
      />
      <Container className="py-10">
        {loading ? (
          <LoadingSkeleton variant="card" count={6} />
        ) : error ? (
          <ErrorState message={error} />
        ) : teams.length === 0 ? (
          <EmptyState
            icon={<Users className="size-6" />}
            title="Henüz takım yok"
            description="Takımlar kaydoldukça burada listelenecek."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                playerCount={playerCountByTeam.get(team.id) ?? 0}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
