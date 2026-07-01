"use client";

import * as React from "react";
import { CalendarCheck, CalendarClock, CalendarDays, Users } from "lucide-react";

import type { Match, Team } from "@/types";
import { getMatches } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { formatShortDate } from "@/lib/date";
import { useAsyncData } from "@/hooks/use-async-data";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

interface DashboardData {
  teams: Team[];
  matches: Match[];
}

export default function AdminDashboardPage() {
  const { data, loading } = useAsyncData<DashboardData>(async () => {
    const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
    return { teams, matches };
  }, []);

  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const teamMap = React.useMemo(
    () => new Map(teams.map((t) => [t.id, t])),
    [teams],
  );

  const playedCount = matches.filter((m) => m.status === "played").length;
  const upcomingCount = matches.filter((m) => m.status === "scheduled").length;

  const recentScores = matches
    .filter((m) => m.status === "played")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Genel Bakış
        </h1>
        <p className="text-sm text-muted-foreground">
          Ligin güncel durumu ve son aktiviteler.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Toplam Takım" value={teams.length} accent />
            <StatCard
              icon={CalendarDays}
              label="Toplam Maç"
              value={matches.length}
            />
            <StatCard
              icon={CalendarCheck}
              label="Oynanan Maç"
              value={playedCount}
            />
            <StatCard
              icon={CalendarClock}
              label="Yaklaşan Maç"
              value={upcomingCount}
            />
          </div>

          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-heading font-bold">Son Güncellenen Skorlar</h2>
            </div>
            {recentScores.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Henüz skor girilmedi"
                  description="Maç skorları girildikçe burada görünecek."
                />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentScores.map((match) => {
                  const home = teamMap.get(match.homeTeamId);
                  const away = teamMap.get(match.awayTeamId);
                  return (
                    <li
                      key={match.id}
                      className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                    >
                      <span className="flex-1 text-right font-medium">
                        {home?.name ?? "?"}
                      </span>
                      <span className="rounded-md bg-muted px-3 py-1 font-heading font-bold tabular-nums">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <span className="flex-1 font-medium">
                        {away?.name ?? "?"}
                      </span>
                      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
                        {formatShortDate(match.date)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
