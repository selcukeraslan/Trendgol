import type { Team } from "@/types";
import teamsSeed from "@/data/teams.json";
import { createCollection } from "./base";

const collection = createCollection<Team>("teams", teamsSeed as Team[], "t");

export const getTeams = collection.getAll;
export const getTeamById = collection.getById;
export const updateTeam = collection.update;
export const deleteTeam = collection.remove;

/** Yeni takım oluşturur; createdAt otomatik atanır. */
export async function createTeam(
  input: Omit<Team, "id" | "createdAt">,
): Promise<Team> {
  return collection.create({
    ...input,
    createdAt: new Date().toISOString(),
  });
}
