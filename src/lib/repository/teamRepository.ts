import type { Team, TeamGroup } from "@/types";
import { getSupabase } from "@/lib/supabase/client";

const TABLE = "teams";

interface TeamRow {
  id: string;
  name: string;
  logo_url: string | null;
  color: string;
  captain: string;
  description: string;
  photo_url: string | null;
  group_name: string | null;
  created_at: string;
}

function fromRow(r: TeamRow): Team {
  return {
    id: r.id,
    name: r.name,
    logoUrl: r.logo_url ?? undefined,
    color: r.color,
    captain: r.captain,
    description: r.description,
    photoUrl: r.photo_url ?? undefined,
    group: (r.group_name as TeamGroup) || undefined,
    createdAt: r.created_at,
  };
}

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as TeamRow[]).map(fromRow);
}

export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as TeamRow) : null;
}

export async function createTeam(
  input: Omit<Team, "id" | "createdAt">,
): Promise<Team> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert({
      name: input.name,
      logo_url: input.logoUrl ?? null,
      color: input.color,
      captain: input.captain,
      description: input.description,
      photo_url: input.photoUrl ?? null,
      group_name: input.group || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as TeamRow);
}

export async function updateTeam(
  id: string,
  input: Partial<Omit<Team, "id">>,
): Promise<Team> {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.logoUrl !== undefined) patch.logo_url = input.logoUrl || null;
  if (input.color !== undefined) patch.color = input.color;
  if (input.captain !== undefined) patch.captain = input.captain;
  if (input.description !== undefined) patch.description = input.description;
  if (input.photoUrl !== undefined) patch.photo_url = input.photoUrl || null;
  if (input.group !== undefined) patch.group_name = input.group || null;

  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as TeamRow);
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await getSupabase().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Takımı siler. İlişkili oyuncu ve maçlar veritabanında ON DELETE CASCADE ile
 * otomatik temizlenir (bkz. supabase/schema.sql).
 */
export async function deleteTeamCascade(teamId: string): Promise<void> {
  await deleteTeam(teamId);
}
