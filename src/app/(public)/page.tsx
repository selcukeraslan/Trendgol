"use client";

import * as React from "react";

import type { BlogPost, Match, SiteSettings, Team } from "@/types";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { getMatches } from "@/lib/repository/matchRepository";
import { getPublishedBlogPosts } from "@/lib/repository/blogRepository";
import { calculateStandings } from "@/lib/standings";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
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
  blogPosts: BlogPost[];
}

export default function Home() {
  const { data, loading, error } = useAsyncData<LandingData>(async () => {
    const [settings, teams, matches, blogPosts] = await Promise.all([
      getSiteSettings(),
      getTeams(),
      getMatches(),
      getPublishedBlogPosts(),
    ]);
    return { settings, teams, matches, blogPosts };
  }, []);

  const settings = data?.settings;
  const teams = React.useMemo(() => data?.teams ?? [], [data]);
  const matches = React.useMemo(() => data?.matches ?? [], [data]);
  const blogPosts = React.useMemo(() => data?.blogPosts ?? [], [data]);
  const standings = React.useMemo(
    () => calculateStandings(teams, matches),
    [teams, matches],
  );

  return (
    <>
      <Hero settings={settings} posts={blogPosts} />
      {error ? (
        <Container className="py-12">
          <ErrorState message={error} />
        </Container>
      ) : loading ? (
        <Container className="py-12">
          <LoadingSkeleton variant="card" count={3} />
        </Container>
      ) : (
        <>
          <UpcomingMatches matches={matches} teams={teams} />
          <StandingsSummary standings={standings} teams={teams} />
          <HowToJoin settings={settings} />
          <ParticipationTerms settings={settings} teamCount={teams.length} />
          <SponsorArea sponsors={settings?.sponsors} />
          <CtaSection settings={settings} />
        </>
      )}
    </>
  );
}
