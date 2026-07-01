import type { MatchStatus, PlayerPosition } from "@/types";

/** Maç durumu → Türkçe etiket. */
export const matchStatusLabels: Record<MatchStatus, string> = {
  scheduled: "Planlandı",
  played: "Oynandı",
  postponed: "Ertelendi",
};

/** Oyuncu mevkii → Türkçe etiket. */
export const playerPositionLabels: Record<PlayerPosition, string> = {
  goalkeeper: "Kaleci",
  defender: "Defans",
  midfielder: "Orta Saha",
  forward: "Forvet",
};
