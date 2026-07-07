// Maç formu doğrulama şeması. Takım farklılığı ve oynanan maç skoru kuralları içerir.
import { z } from "zod";

export const matchSchema = z
  .object({
    week: z.string().min(1, "Hafta gerekli."),
    homeTeamId: z.string().min(1, "Ev sahibi seçin."),
    awayTeamId: z.string().min(1, "Deplasman seçin."),
    date: z.string().min(1, "Tarih gerekli."),
    time: z.string().min(1, "Saat gerekli."),
    venue: z.string().min(1, "Saha gerekli."),
    status: z.enum(["scheduled", "played", "postponed"]),
    homeScore: z.string().optional(),
    awayScore: z.string().optional(),
    scorers: z
      .array(
        z.object({
          playerId: z.string().min(1, "Oyuncu seçin."),
          goals: z.string().min(1, "Gol sayısı girin."),
        }),
      )
      .optional(),
  })
  .refine((d) => d.homeTeamId !== d.awayTeamId, {
    message: "Ev sahibi ve deplasman farklı olmalı.",
    path: ["awayTeamId"],
  })
  .refine((d) => d.status !== "played" || (!!d.homeScore && !!d.awayScore), {
    message: "Oynanan maç için skor girin.",
    path: ["homeScore"],
  });

export type MatchFormValues = z.infer<typeof matchSchema>;
