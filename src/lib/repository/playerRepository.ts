import type { Player, PlayerPosition } from "@/types";
import { getSupabase } from "@/lib/supabase/client";

const TABLE = "players";

interface PlayerRow {
  id: string;
  team_id: string;
  name: string;
  number: number | null;
  position: string | null;
}

function fromRow(r: PlayerRow): Player {
  return {
    id: r.id,
    teamId: r.team_id,
    name: r.name,
    number: r.number ?? undefined,
    position: (r.position as PlayerPosition | null) ?? undefined,
  };
}

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await getSupabase().from(TABLE).select("*");
  if (error) throw new Error(error.message);
  return (data as PlayerRow[]).map(fromRow);
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as PlayerRow) : null;
}

export async function createPlayer(input: Omit<Player, "id">): Promise<Player> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({
      team_id: input.teamId,
      name: input.name,
      number: input.number ?? null,
      position: input.position ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as PlayerRow);
}

export async function updatePlayer(
  id: string,
  input: Partial<Omit<Player, "id">>,
): Promise<Player> {
  const patch: Record<string, unknown> = {};
  if (input.teamId !== undefined) patch.team_id = input.teamId;
  if (input.name !== undefined) patch.name = input.name;
  if (input.number !== undefined) patch.number = input.number ?? null;
  if (input.position !== undefined) patch.position = input.position ?? null;

  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as PlayerRow);
}

export async function deletePlayer(id: string): Promise<void> {
  const { error } = await getSupabase().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Belirli bir takımın oyuncularını döner. */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("team_id", teamId);
  if (error) throw new Error(error.message);
  return (data as PlayerRow[]).map(fromRow);
}
