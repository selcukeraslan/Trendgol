import type { Match, MatchStatus } from "@/types";
import matchesSeed from "@/data/matches.json";
import { createCollection } from "./base";

const collection = createCollection<Match>(
  "matches",
  matchesSeed as unknown as Match[],
  "m",
);

export const getMatches = collection.getAll;
export const getMatchById = collection.getById;
export const createMatch = collection.create;
export const updateMatch = collection.update;
export const deleteMatch = collection.remove;

/** Belirli bir haftanın maçlarını döner. */
export async function getMatchesByWeek(week: number): Promise<Match[]> {
  const all = await collection.getAll();
  return all.filter((match) => match.week === week);
}

/** Maç skorunu girer ve durumu "oynandı" olarak işaretler. */
export async function updateMatchScore(
  id: string,
  homeScore: number,
  awayScore: number,
): Promise<Match> {
  return collection.update(id, {
    homeScore,
    awayScore,
    status: "played",
  });
}

/** Maç durumunu günceller. "Oynandı" dışına alınırsa skorlar temizlenir. */
export async function updateMatchStatus(
  id: string,
  status: MatchStatus,
): Promise<Match> {
  const patch: Partial<Match> =
    status === "played"
      ? { status }
      : { status, homeScore: null, awayScore: null };
  return collection.update(id, patch);
}
