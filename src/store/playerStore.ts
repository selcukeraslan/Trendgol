import type { Player } from "@/types";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "@/lib/repository/playerRepository";
import { createCrudStore } from "./createCrudStore";

export type PlayerInput = Omit<Player, "id">;

export const usePlayerStore = createCrudStore<Player, PlayerInput>({
  list: getPlayers,
  create: createPlayer,
  update: updatePlayer,
  remove: deletePlayer,
});
