import type { Match, Player, PlayerCardStat, Team } from "@/types";

/**
 * Kart istatistiklerini oynanan maçların kart kayıtlarından türetir.
 * Yalnızca en az 1 kart gören oyuncular listelenir.
 * Sıralama: kırmızı → sarı → oyuncu adı (tr).
 */
export function calculatePlayerCards(
  players: Player[],
  teams: Team[],
  matches: Match[],
): PlayerCardStat[] {
  const yellow = new Map<string, number>();
  const red = new Map<string, number>();

  for (const match of matches) {
    if (match.status !== "played" || !match.cards) continue;
    for (const card of match.cards) {
      const bucket = card.type === "red" ? red : yellow;
      bucket.set(card.playerId, (bucket.get(card.playerId) ?? 0) + 1);
    }
  }

  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const rows: PlayerCardStat[] = [];
  for (const player of players) {
    const y = yellow.get(player.id) ?? 0;
    const r = red.get(player.id) ?? 0;
    if (y === 0 && r === 0) continue;
    rows.push({
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      teamName: teamMap.get(player.teamId)?.name ?? "?",
      yellow: y,
      red: r,
    });
  }

  rows.sort(
    (a, b) =>
      b.red - a.red ||
      b.yellow - a.yellow ||
      a.playerName.localeCompare(b.playerName, "tr"),
  );

  return rows;
}
