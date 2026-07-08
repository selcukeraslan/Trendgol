import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Standing, Team } from "@/types";
import { Section } from "@/components/common/section";
import { StandingsTable } from "@/components/standings/standings-table";

interface StandingsSummaryProps {
  standings: Standing[];
  teams: Team[];
}

export function StandingsSummary({ standings, teams }: StandingsSummaryProps) {
  if (standings.length === 0) return null;

  return (
    <Section className="bg-card/30">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Puan Durumu
          </h2>
          <p className="mt-1 text-muted-foreground">
            Zirvedeki takımlar. İlk 3 sıra öne çıkar.
          </p>
        </div>
        <Link
          href="/puan-durumu"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:flex"
        >
          Tam tablo
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <StandingsTable
        standings={standings.slice(0, 5)}
        teams={teams}
        compact
        prizeZone={3}
      />
    </Section>
  );
}
