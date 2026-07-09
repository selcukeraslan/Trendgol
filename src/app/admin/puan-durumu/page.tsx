"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { calculateStandings } from "@/lib/standings";
import { groupTeams } from "@/lib/groups";
import { useTeamStore } from "@/store/teamStore";
import { useMatchStore } from "@/store/matchStore";
import { StandingsTable } from "@/components/standings/standings-table";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function AdminStandingsPage() {
  const loadTeams = useTeamStore((s) => s.load);
  const loadMatches = useMatchStore((s) => s.load);
  const teams = useTeamStore((s) => s.items);
  const matches = useMatchStore((s) => s.items);
  const teamsLoaded = useTeamStore((s) => s.loaded);
  const matchesLoaded = useMatchStore((s) => s.loaded);
  const loaded = teamsLoaded && matchesLoaded;

  React.useEffect(() => {
    void loadTeams();
    void loadMatches();
  }, [loadTeams, loadMatches]);

  const buckets = React.useMemo(() => groupTeams(teams), [teams]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Puan Durumu
        </h1>
        <p className="text-sm text-muted-foreground">
          Tablo, girilen maç skorlarından otomatik hesaplanır.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
        <p>
          Puan durumu manuel düzenlenmez. Değişiklik için{" "}
          <span className="font-medium text-foreground">
            Fikstür Yönetimi
          </span>{" "}
          ekranından maç skorlarını güncelleyin.
        </p>
      </div>

      {!loaded ? (
        <LoadingSkeleton variant="row" count={8} />
      ) : (
        <div className="space-y-8">
          {buckets.map((bucket) => (
            <div key={bucket.key} className="space-y-3">
              {bucket.label ? (
                <h2 className="font-heading text-lg font-bold tracking-tight">
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
        </div>
      )}
    </div>
  );
}
