import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import type { Team } from "@/types";
import { TeamLogo } from "@/components/teams/team-logo";

interface TeamCardProps {
  team: Team;
  playerCount: number;
}

export function TeamCard({ team, playerCount }: TeamCardProps) {
  return (
    <Link
      href={`/takimlar/${team.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg"
    >
      {/* Renk vurgusu */}
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: team.color }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-4">
        <TeamLogo team={team} size="lg" />
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold tracking-tight">
            {team.name}
          </h3>
          <p className="text-sm text-muted-foreground">Kaptan: {team.captain}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {team.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="size-4" aria-hidden="true" />
          {playerCount} oyuncu
        </span>
        <span className="flex items-center gap-1 font-medium text-brand">
          Detay
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
