"use client";

import * as React from "react";
import { ListOrdered } from "lucide-react";

import type { Match, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { calculateStandings } from "@/lib/standings";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { StandingsTable } from "@/components/standings/standings-table";

interface StandingsData {
  teams: Team[];
  matches: Match[];
}

export default function StandingsPage() {
  const { data, loading, error } = useAsyncData<StandingsData>(async () => {
    const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
    return { teams, matches };
  }, []);

  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const standings = React.useMemo(
    () => calculateStandings(teams, matches),
    [teams, matches],
  );

  return (
    <>
      <PageHeader
        eyebrow="Sezon 2026"
        title="Puan Durumu"
        description="Puanlar oynanan maç skorlarından otomatik hesaplanır. İlk 3 takım ödül bölgesindedir."
      />
      <Container className="py-10">
        {loading ? (
          <LoadingSkeleton variant="row" count={8} />
        ) : error ? (
          <ErrorState message={error} />
        ) : standings.length === 0 ? (
          <EmptyState
            icon={<ListOrdered className="size-6" />}
            title="Puan durumu henüz oluşmadı"
            description="Maçlar oynandıkça puan durumu burada görünecek."
          />
        ) : (
          <div className="space-y-4">
            <StandingsTable
              standings={standings}
              teams={teams}
              prizeZone={3}
            />
            <p className="text-xs text-muted-foreground">
              O: Oynanan · G: Galibiyet · B: Beraberlik · M: Mağlubiyet · AG:
              Atılan Gol · YG: Yenilen Gol · Av: Averaj · P: Puan · Form: Son 5
              maç (soldan sağa eskiden yeniye)
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
