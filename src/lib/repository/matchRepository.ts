import type { CardRecord, Match, MatchScorer, MatchStatus } from "@/types";
import { getSupabase } from "@/lib/supabase/client";

const TABLE = "matches";

interface MatchRow {
  id: string;
  week: number;
  home_team_id: string;
  away_team_id: string;
  date: string | null;
  time: string;
  venue: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  scorers: MatchScorer[] | null;
  cards: CardRecord[] | null;
}

function fromRow(r: MatchRow): Match {
  return {
    id: r.id,
    week: r.week,
    homeTeamId: r.home_team_id,
    awayTeamId: r.away_team_id,
    date: r.date ?? "",
    time: r.time,
    venue: r.venue,
    status: r.status as MatchStatus,
    homeScore: r.home_score,
    awayScore: r.away_score,
    scorers: r.scorers ?? [],
    cards: r.cards ?? [],
  };
}

function toRow(input: Partial<Omit<Match, "id">>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if (input.week !== undefined) patch.week = input.week;
  if (input.homeTeamId !== undefined) patch.home_team_id = input.homeTeamId;
  if (input.awayTeamId !== undefined) patch.away_team_id = input.awayTeamId;
  // Boş tarih timestamptz için null olmalı ("" geçersizdir).
  if (input.date !== undefined) patch.date = input.date ? input.date : null;
  if (input.time !== undefined) patch.time = input.time;
  if (input.venue !== undefined) patch.venue = input.venue;
  if (input.status !== undefined) patch.status = input.status;
  if (input.homeScore !== undefined) patch.home_score = input.homeScore;
  if (input.awayScore !== undefined) patch.away_score = input.awayScore;
  if (input.scorers !== undefined) patch.scorers = input.scorers;
  if (input.cards !== undefined) patch.cards = input.cards;
  return patch;
}

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("week", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as MatchRow[]).map(fromRow);
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as MatchRow) : null;
}

export async function createMatch(input: Omit<Match, "id">): Promise<Match> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert(toRow(input))
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as MatchRow);
}

export async function updateMatch(
  id: string,
  input: Partial<Omit<Match, "id">>,
): Promise<Match> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(toRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as MatchRow);
}

export async function deleteMatch(id: string): Promise<void> {
  const { error } = await getSupabase().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Belirli bir haftanın maçlarını döner. */
export async function getMatchesByWeek(week: number): Promise<Match[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("week", week);
  if (error) throw new Error(error.message);
  return (data as MatchRow[]).map(fromRow);
}

/** Maç skorunu girer ve durumu "oynandı" olarak işaretler. */
export async function updateMatchScore(
  id: string,
  homeScore: number,
  awayScore: number,
): Promise<Match> {
  return updateMatch(id, { homeScore, awayScore, status: "played" });
}

/** Maç durumunu günceller. "Oynandı" dışına alınırsa skor ve golcüler temizlenir. */
export async function updateMatchStatus(
  id: string,
  status: MatchStatus,
): Promise<Match> {
  const patch: Partial<Match> =
    status === "played"
      ? { status }
      : { status, homeScore: null, awayScore: null, scorers: [], cards: [] };
  return updateMatch(id, patch);
}
