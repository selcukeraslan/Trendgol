import { CheckCircle2, Coins, FileText, Trophy, Wallet } from "lucide-react";

import type { SiteSettings } from "@/types";
import { DEFAULT_PARTICIPATION_TERMS } from "@/lib/content-defaults";
import { Section } from "@/components/common/section";

/** Gösterilebilir bir tutar mı? Boş, "—" veya sıfır değerler gizlenir. */
function hasAmount(value?: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "—") return false;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length > 0 && Number(digits) === 0) return false;
  return true;
}

export function ParticipationTerms({ settings }: { settings?: SiteSettings }) {
  const terms =
    settings?.participationTerms && settings.participationTerms.length > 0
      ? settings.participationTerms
      : DEFAULT_PARTICIPATION_TERMS;
  const rulesPdfUrl = settings?.rulesPdfUrl;

  const cards = [
    {
      icon: Wallet,
      label: "Katılım Ücreti",
      value: settings?.entryFee ?? "—",
      hint: "Sezon başı, tek seferlik",
    },
    {
      icon: Coins,
      label: "Maç Başı Ücret",
      value: settings?.perMatchFee ?? "—",
      hint: "Her maç öncesi",
    },
    {
      icon: Trophy,
      label: "Ödül Havuzu",
      value: settings?.prizePool ?? "—",
      hint: "Sezon sonu şampiyona",
      highlight: true,
    },
  ];

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Ücretler */}
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className={
                "rounded-xl border bg-card p-5 text-center " +
                (card.highlight
                  ? "border-gold/40 bg-gold/5"
                  : "border-border")
              }
            >
              <card.icon
                className={
                  "mx-auto mb-2 size-6 " +
                  (card.highlight ? "text-gold" : "text-brand")
                }
                aria-hidden="true"
              />
              {hasAmount(card.value) ? (
                <div className="font-heading text-xl font-bold">
                  {card.value}
                </div>
              ) : null}
              <div className="mt-1 text-sm font-medium">{card.label}</div>
              <div className="text-xs text-muted-foreground">{card.hint}</div>
            </div>
          ))}
        </div>

        {/* Katılım şartları */}
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Katılım Şartları
          </h2>
          <ul className="mt-4 space-y-3">
            {terms.map((term) => (
              <li key={term} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{term}</span>
              </li>
            ))}
          </ul>

          {rulesPdfUrl ? (
            <a
              href={rulesPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <FileText className="size-4" aria-hidden="true" />
              Kuralları İncele (PDF)
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
