import type { Match, Player, Team, TopScorer } from "@/types";

/**
 * Oynanan maçların golcü kayıtlarından oyuncu bazında toplam gol haritası üretir.
 * Kaynak gerçeği maçlardır (bkz. standings.ts ile aynı ilke).
 */
export function buildPlayerGoals(matches: Match[]): Map<string, number> {
  const goals = new Map<string, number>();
  for (const match of matches) {
    if (match.status !== "played" || !match.scorers) continue;
    for (const scorer of match.scorers) {
      goals.set(scorer.playerId, (goals.get(scorer.playerId) ?? 0) + scorer.goals);
    }
  }
  return goals;
}

/**
 * Gol krallığı tablosunu maçlardan türetir. Yalnızca en az 1 gol atan
 * oyuncular listelenir. Sıralama: gol → oyuncu adı (tr).
 */
export function calculateTopScorers(
  players: Player[],
  teams: Team[],
  matches: Match[],
): TopScorer[] {
  const goals = buildPlayerGoals(matches);
  const teamMap = new Map(teams.map((team) => [team.id, team]));

  const rows: TopScorer[] = [];
  for (const player of players) {
    const total = goals.get(player.id) ?? 0;
    if (total <= 0) continue;
    rows.push({
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      teamName: teamMap.get(player.teamId)?.name ?? "?",
      goals: total,
    });
  }

  rows.sort(
    (a, b) =>
      b.goals - a.goals || a.playerName.localeCompare(b.playerName, "tr"),
  );

  return rows;
}
