import type { Team } from "@/types";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeamCascade,
} from "@/lib/repository/teamRepository";
import { createCrudStore } from "./createCrudStore";

export type TeamInput = Omit<Team, "id" | "createdAt">;

// Silme, ilişkili oyuncu ve maçları da temizleyen kaskad işlemi kullanır.
export const useTeamStore = createCrudStore<Team, TeamInput>({
  list: getTeams,
  create: createTeam,
  update: updateTeam,
  remove: deleteTeamCascade,
});
