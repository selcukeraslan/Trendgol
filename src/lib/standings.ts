import type { Match, Standing, Team } from "@/types";

const WIN_POINTS = 3;
const DRAW_POINTS = 1;

/**
 * Puan durumunu maç skorlarından hesaplar. Kaynak gerçeği maçlardır.
 * Yalnızca "oynandı" durumundaki ve skoru girilmiş maçlar dikkate alınır.
 * Sıralama: puan → averaj → atılan gol → takım adı.
 */
export function calculateStandings(
  teams: Team[],
  matches: Match[],
): Standing[] {
  const table = new Map<string, Standing>();

  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    });
  }

  // Form kronolojik olmalı: oynanan maçları tarihe (ve saate) göre sırala.
  const playedMatches = matches
    .filter(
      (m) =>
        m.status === "played" &&
        m.homeScore != null &&
        m.awayScore != null,
    )
    .sort((a, b) => {
      // Tarihsiz maçlar sona alınır.
      const at = a.date ? new Date(a.date).getTime() : Infinity;
      const bt = b.date ? new Date(b.date).getTime() : Infinity;
      const diff = at - bt;
      return diff !== 0 ? diff : a.time.localeCompare(b.time);
    });

  for (const match of playedMatches) {
    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);
    if (!home || !away) continue;

    const homeScore = match.homeScore as number;
    const awayScore = match.awayScore as number;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.won += 1;
      home.points += WIN_POINTS;
      away.lost += 1;
      home.form.push("W");
      away.form.push("L");
    } else if (homeScore < awayScore) {
      away.won += 1;
      away.points += WIN_POINTS;
      home.lost += 1;
      home.form.push("L");
      away.form.push("W");
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += DRAW_POINTS;
      away.points += DRAW_POINTS;
      home.form.push("D");
      away.form.push("D");
    }
  }

  const standings = Array.from(table.values());
  for (const row of standings) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName, "tr");
  });

  return standings;
}
