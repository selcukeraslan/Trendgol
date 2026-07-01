import type { Player } from "@/types";
import playersSeed from "@/data/players.json";
import { createCollection } from "./base";

const collection = createCollection<Player>(
  "players",
  playersSeed as unknown as Player[],
  "p",
);

export const getPlayers = collection.getAll;
export const getPlayerById = collection.getById;
export const createPlayer = collection.create;
export const updatePlayer = collection.update;
export const deletePlayer = collection.remove;

/** Belirli bir takımın oyuncularını döner. */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const all = await collection.getAll();
  return all.filter((player) => player.teamId === teamId);
}
