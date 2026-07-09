// Maç formu doğrulama şeması. Takım farklılığı ve oynanan maç skoru kuralları içerir.
import { z } from "zod";

// Yalnızca ev sahibi/deplasman takımları zorunludur; hafta, tarih, saat, saha
// ve skorlar opsiyoneldir. Boş bırakılan alanlar kayıtta boş/null olur.
export const matchSchema = z
  .object({
    week: z.string(),
    homeTeamId: z.string().min(1, "Ev sahibi seçin."),
    awayTeamId: z.string().min(1, "Deplasman seçin."),
    date: z.string(),
    time: z.string(),
    venue: z.string(),
    status: z.enum(["scheduled", "played", "postponed"]),
    homeScore: z.string().optional(),
    awayScore: z.string().optional(),
    scorers: z
      .array(
        z.object({
          playerId: z.string(),
          goals: z.string(),
        }),
      )
      .optional(),
    cards: z
      .array(
        z.object({
          playerId: z.string(),
          type: z.enum(["yellow", "red"]),
        }),
      )
      .optional(),
  })
  .refine((d) => d.homeTeamId !== d.awayTeamId, {
    message: "Ev sahibi ve deplasman farklı olmalı.",
    path: ["awayTeamId"],
  });

export type MatchFormValues = z.infer<typeof matchSchema>;
