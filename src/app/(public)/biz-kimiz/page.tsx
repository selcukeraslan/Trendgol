"use client";

import Link from "next/link";
import { Award, Scale, ShieldCheck, Target, Trophy, Users } from "lucide-react";

import type { SiteSettings, Team } from "@/types";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { getTeams } from "@/lib/repository/teamRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AboutData {
  settings: SiteSettings;
  teams: Team[];
}

const values = [
  {
    icon: Scale,
    title: "Adil Rekabet",
    text: "Şeffaf fikstür ve tarafsız hakemlik ile her takıma eşit şans.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenilir Ödeme",
    text: "Katılım ve ödül süreçleri net, izlenebilir ve güvence altında.",
  },
  {
    icon: Target,
    title: "Profesyonel Organizasyon",
    text: "Amatör futbolu profesyonel bir işleyişle buluşturuyoruz.",
  },
];

export default function AboutPage() {
  const { data } = useAsyncData<AboutData>(async () => {
    const [settings, teams] = await Promise.all([getSiteSettings(), getTeams()]);
    return { settings, teams };
  }, []);

  const settings = data?.settings;
  const teamCount = data?.teams.length ?? 0;

  const stats = [
    { icon: Users, label: "Takım", value: teamCount > 0 ? `${teamCount}` : "—" },
    {
      icon: Trophy,
      label: "Ödül Havuzu",
      value: settings?.prizePool ?? "—",
    },
    { icon: Award, label: "Sezon", value: "2026" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Biz Kimiz"
        description="Halı saha futbolunu profesyonel bir lig deneyimine dönüştürüyoruz."
      />

      <Container className="space-y-16 py-12">
        {/* Hikaye */}
        <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Lig Hikayemiz
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
            Misyonumuz
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Her seviyeden futbolseveri, adil ve güvenilir bir ortamda
            buluşturmak; kazananı sahada belli olan, ödülü hak edenin aldığı bir
            lig deneyimi sunmak.
          </p>
        </section>

        {/* Değerler */}
        <section>
          <h2 className="mb-6 text-center font-heading text-2xl font-bold tracking-tight">
            Neden Bize Güvenmelisiniz?
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <value.icon
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
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-brand/30 bg-brand/5 p-8 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Sen de aramıza katıl
          </h2>
          <p className="max-w-md text-muted-foreground">
            Takımını kaydet, sahaya çık ve ödül havuzundan payını al.
          </p>
          <Link href="/iletisim" className={cn(buttonVariants({ size: "lg" }))}>
            Takımını Kaydet
          </Link>
        </section>
      </Container>
    </>
  );
}
