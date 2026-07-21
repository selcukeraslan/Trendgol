"use client";

import * as React from "react";
import { ListOrdered } from "lucide-react";

import type { Match, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { calculateStandings } from "@/lib/standings";
import { groupTeams } from "@/lib/groups";
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
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const { data, loading, error } = useAsyncData<StandingsData>(async () => {
    const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
    return { teams, matches };
  }, []);

  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const buckets = React.useMemo(() => groupTeams(teams), [teams]);
  const visibleBuckets = React.useMemo(
    () =>
      selectedGroup
        ? buckets.filter((bucket) => bucket.key === selectedGroup)
        : buckets,
    [buckets, selectedGroup],
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
        ) : teams.length === 0 ? (
          <EmptyState
            icon={<ListOrdered className="size-6" />}
            title="Puan durumu henüz oluşmadı"
            description="Maçlar oynandıkça puan durumu burada görünecek."
          />
        ) : (
          <div className="space-y-8">
            {buckets.length > 1 || buckets.some((bucket) => bucket.label) ? (
              <div className="flex justify-end">
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Lig / Grup:</span>
                  <select
                    value={selectedGroup}
                    onChange={(event) => setSelectedGroup(event.target.value)}
                    className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Tümü</option>
                    {buckets.map((bucket) => (
                      <option key={bucket.key} value={bucket.key}>
                        {bucket.label || "Tüm Takımlar"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {visibleBuckets.map((bucket) => (
              <div key={bucket.key} className="space-y-3">
                {bucket.label ? (
                  <h2 className="font-heading text-xl font-bold tracking-tight">
                    {bucket.label}
                  </h2>
                ) : null}
                <StandingsTable
                  standings={calculateStandings(bucket.teams, matches)}
                  teams={bucket.teams}
                  prizeZone={3}
                />
              </div>
            ))}
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
