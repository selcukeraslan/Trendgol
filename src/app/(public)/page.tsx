"use client";

import * as React from "react";

import type { Match, SiteSettings, Team } from "@/types";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { getMatches } from "@/lib/repository/matchRepository";
import { calculateStandings } from "@/lib/standings";
import { useAsyncData } from "@/hooks/use-async-data";
import { Hero } from "@/components/landing/hero";
import { ParticipationTerms } from "@/components/landing/participation-terms";
import { HowToJoin } from "@/components/landing/how-to-join";
import { UpcomingMatches } from "@/components/landing/upcoming-matches";
import { StandingsSummary } from "@/components/landing/standings-summary";
import { SponsorArea } from "@/components/landing/sponsor-area";
import { CtaSection } from "@/components/landing/cta-section";

interface LandingData {
  settings: SiteSettings;
  teams: Team[];
  matches: Match[];
}

export default function Home() {
  const { data } = useAsyncData<LandingData>(async () => {
    const [settings, teams, matches] = await Promise.all([
      getSiteSettings(),
      getTeams(),
      getMatches(),
    ]);
    return { settings, teams, matches };
  }, []);

  const settings = data?.settings;
  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const standings = React.useMemo(
    () => calculateStandings(teams, matches),
    [teams, matches],
  );

  return (
    <>
      <Hero settings={settings} />
      <ParticipationTerms settings={settings} />
      <UpcomingMatches matches={matches} teams={teams} />
      <StandingsSummary standings={standings} teams={teams} />
      <HowToJoin />
      <SponsorArea />
      <CtaSection />
    </>
  );
}
