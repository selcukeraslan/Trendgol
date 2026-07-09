import { ClipboardList, CreditCard, Flag, Users } from "lucide-react";

import type { SiteSettings } from "@/types";
import { DEFAULT_HOW_TO_JOIN_STEPS } from "@/lib/content-defaults";
import { Section } from "@/components/common/section";

// İkonlar sabit (sıraya göre); başlık/metin ayarlardan düzenlenebilir.
const STEP_ICONS = [ClipboardList, Users, CreditCard, Flag];

export function HowToJoin({ settings }: { settings?: SiteSettings }) {
  const steps =
    settings?.howToJoinSteps && settings.howToJoinSteps.length > 0
      ? settings.howToJoinSteps
      : DEFAULT_HOW_TO_JOIN_STEPS;

  return (
    <Section className="bg-card/30">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Nasıl Katılırım?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Dört basit adımda lige katıl ve mücadeleye başla.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index % STEP_ICONS.length];
          return (
            <div
              key={index}
              className="relative rounded-xl border border-border bg-card p-6"
            >
              <span className="absolute right-4 top-4 font-heading text-3xl font-bold text-muted/40">
                {index + 1}
              </span>
              <span className="flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
