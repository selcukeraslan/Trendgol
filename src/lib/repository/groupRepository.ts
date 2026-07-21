import type { LeagueGroup } from "@/types";
import { getSupabase } from "@/lib/supabase/client";

const TABLE = "league_groups";

interface GroupRow {
  name: string;
  created_at: string;
}

function fromRow(row: GroupRow): LeagueGroup {
  return { name: row.name, createdAt: row.created_at };
}

export async function getGroups(): Promise<LeagueGroup[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as GroupRow[]).map(fromRow);
}

export async function createGroup(name: string): Promise<LeagueGroup> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({ name: name.trim() })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as GroupRow);
}

export async function renameGroup(
  currentName: string,
  nextName: string,
): Promise<LeagueGroup> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update({ name: nextName.trim() })
    .eq("name", currentName)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as GroupRow);
}

export async function deleteGroup(name: string): Promise<void> {
  const { error } = await getSupabase().from(TABLE).delete().eq("name", name);
  if (error) throw new Error(error.message);
}
