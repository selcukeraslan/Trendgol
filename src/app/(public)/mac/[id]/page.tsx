"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Goal, MapPin } from "lucide-react";

import type { Match, Player, Team } from "@/types";
import { getMatchById } from "@/lib/repository/matchRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { getPlayers } from "@/lib/repository/playerRepository";
import { formatMatchDate } from "@/lib/date";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { TeamLogo } from "@/components/teams/team-logo";
import { StatusBadge } from "@/components/fixtures/status-badge";

interface MatchDetailData {
  match: Match | null;
  teams: Team[];
  players: Player[];
}

interface ScorerRow {
  name: string;
  goals: number;
}

/** Bir takımın golcü listesi (hizalanabilir). */
function ScorerList({
  scorers,
  align,
}: {
  scorers: ScorerRow[];
  align: "left" | "right";
}) {
  if (scorers.length === 0) {
    return (
      <p
        className={
          "text-sm text-muted-foreground " +
          (align === "right" ? "sm:text-right" : "")
        }
      >
        Gol yok
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {scorers.map((scorer, index) => (
        <li
          key={`${scorer.name}-${index}`}
          className={
            "flex items-center gap-1.5 text-sm " +
            (align === "right" ? "sm:flex-row-reverse sm:text-right" : "")
          }
        >
          <Goal className="size-4 shrink-0 text-brand" aria-hidden="true" />
          <span className="font-medium">{scorer.name}</span>
          {scorer.goals > 1 ? (
            <span className="text-muted-foreground">({scorer.goals})</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useAsyncData<MatchDetailData>(async () => {
    const [match, teams, players] = await Promise.all([
      getMatchById(id),
      getTeams(),
      getPlayers(),
    ]);
    return { match, teams, players };
  }, [id]);

  if (loading) {
    return (
      <Container className="py-10">
        <LoadingSkeleton variant="card" count={2} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <ErrorState message={error} />
      </Container>
    );
  }

  const match = data?.match ?? null;

  if (!match) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Maç bulunamadı"
          description="Aradığınız maç mevcut değil veya kaldırılmış olabilir."
          action={
            <Link href="/fikstur" className="text-sm font-medium text-brand">
              Fikstüre dön
            </Link>
          }
        />
      </Container>
    );
  }

  const teams = data?.teams ?? [];
  const players = data?.players ?? [];
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const playerMap = new Map(players.map((p) => [p.id, p]));
  const homeTeam = teamMap.get(match.homeTeamId);
  const awayTeam = teamMap.get(match.awayTeamId);
  const isPlayed = match.status === "played";

  function toScorerRows(teamId: string): ScorerRow[] {
    return (match?.scorers ?? [])
      .filter((s) => playerMap.get(s.playerId)?.teamId === teamId)
      .map((s) => ({
        name: playerMap.get(s.playerId)?.name ?? "Bilinmeyen oyuncu",
        goals: s.goals,
      }));
  }

  const homeScorers = toScorerRows(match.homeTeamId);
  const awayScorers = toScorerRows(match.awayTeamId);
  const hasScorers = homeScorers.length + awayScorers.length > 0;

  return (
    <Container className="space-y-8 py-10">
      <Link
        href="/fikstur"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Fikstür
      </Link>

      {/* Skorbord */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {match.week}. Hafta
          </span>
          <StatusBadge status={match.status} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          {/* Ev sahibi */}
          <Link
            href={homeTeam ? `/takimlar/${homeTeam.id}` : "#"}
            className="flex flex-col items-center gap-3 text-center transition-colors hover:text-brand"
          >
            {homeTeam ? <TeamLogo team={homeTeam} size="lg" /> : null}
            <span className="font-heading font-bold sm:text-lg">
              {homeTeam?.name ?? "?"}
            </span>
          </Link>

          {/* Skor */}
          <div className="text-center">
            {isPlayed ? (
              <div className="font-heading text-4xl font-bold tabular-nums sm:text-5xl">
                {match.homeScore}
                <span className="mx-2 text-muted-foreground">-</span>
                {match.awayScore}
              </div>
            ) : (
              <div className="font-heading text-2xl text-muted-foreground">
                {match.status === "postponed" ? "Ertelendi" : match.time}
              </div>
            )}
          </div>

          {/* Deplasman */}
          <Link
            href={awayTeam ? `/takimlar/${awayTeam.id}` : "#"}
            className="flex flex-col items-center gap-3 text-center transition-colors hover:text-brand"
          >
            {awayTeam ? <TeamLogo team={awayTeam} size="lg" /> : null}
            <span className="font-heading font-bold sm:text-lg">
              {awayTeam?.name ?? "?"}
            </span>
          </Link>
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border/60 pt-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatMatchDate(match.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {match.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {match.venue}
          </span>
        </div>
      </div>

      {/* Goller */}
      <section>
        <h2 className="mb-4 font-heading text-xl font-bold tracking-tight">
          Goller
        </h2>
        {!isPlayed ? (
          <EmptyState
            icon={<Goal className="size-6" />}
            title="Maç henüz oynanmadı"
            description="Karşılaşma oynandığında golcüler burada listelenecek."
          />
        ) : !hasScorers ? (
          <EmptyState
            icon={<Goal className="size-6" />}
            title="Golcü bilgisi girilmemiş"
            description="Bu maç için henüz golcü bilgisi kaydedilmemiş."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
            <div>
              <div className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:text-right">
                {homeTeam?.name ?? "Ev sahibi"}
              </div>
              <ScorerList scorers={homeScorers} align="right" />
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {awayTeam?.name ?? "Deplasman"}
              </div>
              <ScorerList scorers={awayScorers} align="left" />
            </div>
          </div>
        )}
      </section>
    </Container>
  );
}
