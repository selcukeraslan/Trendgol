"use client";

import Link from "next/link";
import { Award, Scale, ShieldCheck, Target, Trophy, Users } from "lucide-react";

import type { SiteSettings, Team } from "@/types";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_ABOUT_VALUES,
} from "@/lib/content-defaults";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AboutData {
  settings: SiteSettings;
  teams: Team[];
}

const valueIcons = [Scale, ShieldCheck, Target];

export default function AboutPage() {
  const { data } = useAsyncData<AboutData>(async () => {
    const [settings, teams] = await Promise.all([getSiteSettings(), getTeams()]);
    return { settings, teams };
  }, []);

  const settings = data?.settings;
  const teamCount = data?.teams.length ?? 0;
  const values =
    settings?.aboutValues && settings.aboutValues.length > 0
      ? settings.aboutValues
      : DEFAULT_ABOUT_VALUES;

  const stats = [
    {
      icon: Users,
      label: settings?.aboutTeamLabel || DEFAULT_ABOUT_CONTENT.teamLabel,
      value: teamCount > 0 ? `${teamCount}` : "—",
    },
    {
      icon: Trophy,
      label:
        settings?.aboutPrizePoolLabel ||
        DEFAULT_ABOUT_CONTENT.prizePoolLabel,
      value: settings?.prizePool ?? "—",
    },
    {
      icon: Award,
      label: settings?.aboutSeasonLabel || DEFAULT_ABOUT_CONTENT.seasonLabel,
      value: settings?.aboutSeason || DEFAULT_ABOUT_CONTENT.season,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={settings?.aboutEyebrow || DEFAULT_ABOUT_CONTENT.eyebrow}
        title={settings?.aboutTitle || DEFAULT_ABOUT_CONTENT.title}
        description={
          settings?.aboutSubtitle || DEFAULT_ABOUT_CONTENT.subtitle
        }
      />

      <Container className="space-y-16 py-12">
        {/* Hikaye */}
        <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              {settings?.aboutStoryTitle || DEFAULT_ABOUT_CONTENT.storyTitle}
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {settings?.aboutText ??
                "Halı saha ligimiz; dostluğu, rekabeti ve futbol tutkusunu bir araya getiren ücretli katılımlı, para ödüllü bir organizasyondur."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <stat.icon
                  className="mx-auto mb-2 size-5 text-brand"
                  aria-hidden="true"
                />
                <div className="font-heading text-lg font-bold">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Misyon */}
        <section className="rounded-2xl border border-border bg-card/50 p-8 text-center">
          <Target className="mx-auto mb-3 size-7 text-brand" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            {settings?.aboutMissionTitle || DEFAULT_ABOUT_CONTENT.missionTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            {settings?.aboutMissionText || DEFAULT_ABOUT_CONTENT.missionText}
          </p>
        </section>

        {/* Değerler */}
        <section>
          <h2 className="mb-6 text-center font-heading text-2xl font-bold tracking-tight">
            {settings?.aboutValuesTitle || DEFAULT_ABOUT_CONTENT.valuesTitle}
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {values.slice(0, 3).map((value, index) => {
              const ValueIcon = valueIcons[index] ?? Target;
              return (
                <div
                  key={`${value.title}-${index}`}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <ValueIcon
                    className="mb-3 size-6 text-brand"
                    aria-hidden="true"
                  />
                  <h3 className="font-heading text-lg font-bold">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-brand/30 bg-brand/5 p-8 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            {settings?.aboutCtaTitle || DEFAULT_ABOUT_CONTENT.ctaTitle}
          </h2>
          <p className="max-w-md text-muted-foreground">
            {settings?.aboutCtaText || DEFAULT_ABOUT_CONTENT.ctaText}
          </p>
          <Link href="/iletisim" className={cn(buttonVariants({ size: "lg" }))}>
            {settings?.aboutCtaButtonLabel ||
              DEFAULT_ABOUT_CONTENT.ctaButtonLabel}
          </Link>
        </section>
      </Container>
    </>
  );
}
