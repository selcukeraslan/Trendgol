import {
  Award,
  CheckCircle2,
  Coins,
  FileText,
  Target,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { InfoCardIcon, SiteSettings } from "@/types";
import {
  DEFAULT_PARTICIPATION_CARDS,
  DEFAULT_PARTICIPATION_TERMS,
} from "@/lib/content-defaults";
import { resolveInfoCardValue } from "@/lib/info-cards";
import { cn } from "@/lib/utils";
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

const infoCardIcons: Record<InfoCardIcon, LucideIcon> = {
  users: Users,
  trophy: Trophy,
  award: Award,
  wallet: Wallet,
  coins: Coins,
  target: Target,
};

export function ParticipationTerms({
  settings,
  teamCount = 0,
}: {
  settings?: SiteSettings;
  teamCount?: number;
}) {
  const terms =
    settings?.participationTerms && settings.participationTerms.length > 0
      ? settings.participationTerms
      : DEFAULT_PARTICIPATION_TERMS;
  const rulesPdfUrl = settings?.rulesPdfUrl;

  const configuredCards = settings
    ? settings.participationCards
    : DEFAULT_PARTICIPATION_CARDS;
  const cards = configuredCards.map((card) => ({
    ...card,
    icon: infoCardIcons[card.icon] ?? Target,
    value: resolveInfoCardValue(card, settings, teamCount),
  }));

  return (
    <Section>
      <div
        className={cn(
          "grid gap-10 lg:items-center",
          cards.length > 0 && "lg:grid-cols-2",
        )}
      >
        {/* Ücretler */}
        {cards.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-4">
            {cards.map((card, index) => (
              <div
                key={`${card.label}-${index}`}
                className={
                  "rounded-xl border bg-card p-5 text-center " +
                  (card.highlighted
                    ? "border-gold/40 bg-gold/5"
                    : "border-border")
                }
              >
                <card.icon
                  className={
                    "mx-auto mb-2 size-6 " +
                    (card.highlighted ? "text-gold" : "text-brand")
                  }
                  aria-hidden="true"
                />
                {hasAmount(card.value) ? (
                  <div className="font-heading text-xl font-bold">
                    {card.value}
                  </div>
                ) : null}
                <div className="mt-1 text-sm font-medium">{card.label}</div>
                <div className="text-xs text-muted-foreground">
                  {card.hint}
                </div>
              </div>
            ))}
          </div>
        ) : null}

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
