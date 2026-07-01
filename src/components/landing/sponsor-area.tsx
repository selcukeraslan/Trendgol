import { Section } from "@/components/common/section";

const sponsors = [
  "SPOR A.Ş.",
  "HALI SAHA+",
  "GOLCÜ",
  "FUTBOL360",
  "SAHA MARKET",
  "TEKNİK SPOR",
];

export function SponsorArea() {
  return (
    <Section>
      <div className="text-center">
        <h2 className="font-heading text-xl font-bold tracking-tight text-muted-foreground">
          Sponsorlarımız & İş Ortaklarımız
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor}
            className="flex h-16 items-center justify-center rounded-lg border border-border bg-card font-heading text-sm font-semibold tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            {sponsor}
          </div>
        ))}
      </div>
    </Section>
  );
}
