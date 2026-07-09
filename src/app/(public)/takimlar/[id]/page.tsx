"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ImageIcon } from "lucide-react";

import type { Match, Player, Team } from "@/types";
import { getTeams, getTeamById } from "@/lib/repository/teamRepository";
import { getPlayersByTeam } from "@/lib/repository/playerRepository";
import { getMatches } from "@/lib/repository/matchRepository";
import { calculateStandings } from "@/lib/standings";
import { buildPlayerGoals } from "@/lib/scorers";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { TeamLogo } from "@/components/teams/team-logo";
import { PlayerList } from "@/components/teams/player-list";
import { TeamStats } from "@/components/teams/team-stats";
import { MatchCard } from "@/components/fixtures/match-card";

interface TeamDetailData {
  team: Team | null;
  players: Player[];
  teams: Team[];
  matches: Match[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-heading text-xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

export default function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const teamId = params.id;

  const { data, loading } = useAsyncData<TeamDetailData>(async () => {
    const [team, players, teams, matches] = await Promise.all([
      getTeamById(teamId),
      getPlayersByTeam(teamId),
      getTeams(),
      getMatches(),
    ]);
    return { team, players, teams, matches };
  }, [teamId]);

  if (loading) {
    return (
      <Container className="py-10">
        <LoadingSkeleton variant="card" count={3} />
      </Container>
    );
  }

  const team = data?.team ?? null;

  if (!team) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Takım bulunamadı"
          description="Aradığınız takım mevcut değil veya kaldırılmış olabilir."
          action={
            <Link href="/takimlar" className="text-sm font-medium text-brand">
              Takımlara dön
            </Link>
          }
        />
      </Container>
    );
  }

  const teams = data?.teams ?? [];
  const players = data?.players ?? [];
  const matches = data?.matches ?? [];
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const standings = calculateStandings(teams, matches);
  const standing = standings.find((row) => row.teamId === team.id);
  const goalsByPlayer = buildPlayerGoals(matches);

  const recentMatches = matches
    .filter(
      (m) =>
        m.status === "played" &&
        (m.homeTeamId === team.id || m.awayTeamId === team.id),
    )
    .sort(
      (a, b) =>
        (b.date ? new Date(b.date).getTime() : 0) -
        (a.date ? new Date(a.date).getTime() : 0),
    )
    .slice(0, 4);

  return (
    <>
      {/* Takım başlığı */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${team.color}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <Container className="relative py-10 sm:py-14">
          <Link
            href="/takimlar"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Takımlar
          </Link>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <TeamLogo team={team} size="lg" />
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {team.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Kaptan: {team.captain} · {players.length} oyuncu
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-pretty text-muted-foreground">
            {team.description}
          </p>
        </Container>
      </div>

      <Container className="space-y-12 py-10">
        {/* İstatistikler */}
        <section>
          <SectionTitle>İstatistikler</SectionTitle>
          <TeamStats standing={standing} />
        </section>

        {/* Takım görseli (placeholder) */}
        <section>
          <SectionTitle>Takım Fotoğrafı</SectionTitle>
          <div className="flex aspect-[16/6] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
            {team.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.photoUrl}
                alt={`${team.name} takım fotoğrafı`}
                className="size-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-sm">
                <ImageIcon className="size-8" aria-hidden="true" />
                Görsel yakında eklenecek
              </div>
            )}
          </div>
        </section>

        {/* Kadro */}
        <section>
          <SectionTitle>Kadro</SectionTitle>
          <PlayerList players={players} goalsByPlayer={goalsByPlayer} />
        </section>

        {/* Son maçlar */}
        <section>
          <SectionTitle>Son Maçlar</SectionTitle>
          {recentMatches.length === 0 ? (
            <EmptyState
              title="Henüz oynanmış maç yok"
              description="Takımın oynadığı maçlar burada görünecek."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentMatches.map((match) => {
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
          )}
        </section>
      </Container>
    </>
  );
}
