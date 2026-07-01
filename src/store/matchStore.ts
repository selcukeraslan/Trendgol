import { create } from "zustand";

import type { Match, MatchStatus } from "@/types";
import {
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  updateMatchScore,
  updateMatchStatus,
} from "@/lib/repository/matchRepository";

export type MatchInput = Omit<Match, "id">;

interface MatchStoreState {
  items: Match[];
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  add: (input: MatchInput) => Promise<Match>;
  edit: (id: string, input: Partial<MatchInput>) => Promise<Match>;
  remove: (id: string) => Promise<void>;
  setScore: (id: string, home: number, away: number) => Promise<Match>;
  setStatus: (id: string, status: MatchStatus) => Promise<Match>;
}

function replaceItem(items: Match[], updated: Match): Match[] {
  return items.map((item) => (item.id === updated.id ? updated : item));
}

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  items: [],
  loading: false,
  loaded: false,
  load: async () => {
    set({ loading: true });
    const items = await getMatches();
    set({ items, loaded: true, loading: false });
  },
  add: async (input) => {
    const created = await createMatch(input);
    set({ items: [...get().items, created] });
    return created;
  },
  edit: async (id, input) => {
    const updated = await updateMatch(id, input);
    set({ items: replaceItem(get().items, updated) });
    return updated;
  },
  remove: async (id) => {
    await deleteMatch(id);
    set({ items: get().items.filter((item) => item.id !== id) });
  },
  setScore: async (id, home, away) => {
    const updated = await updateMatchScore(id, home, away);
    set({ items: replaceItem(get().items, updated) });
    return updated;
  },
  setStatus: async (id, status) => {
    const updated = await updateMatchStatus(id, status);
    set({ items: replaceItem(get().items, updated) });
    return updated;
  },
}));
