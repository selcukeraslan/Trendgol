import type { Team } from "@/types";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "@/lib/repository/teamRepository";
import { createCrudStore } from "./createCrudStore";

export type TeamInput = Omit<Team, "id" | "createdAt">;

export const useTeamStore = createCrudStore<Team, TeamInput>({
  list: getTeams,
  create: createTeam,
  update: updateTeam,
  remove: deleteTeam,
});
