import { create } from "zustand";

import type { LeagueGroup } from "@/types";
import {
  createGroup,
  deleteGroup,
  getGroups,
  renameGroup,
} from "@/lib/repository/groupRepository";

interface GroupStoreState {
  items: LeagueGroup[];
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  add: (name: string) => Promise<LeagueGroup>;
  rename: (currentName: string, nextName: string) => Promise<LeagueGroup>;
  remove: (name: string) => Promise<void>;
}

export const useGroupStore = create<GroupStoreState>((set, get) => ({
  items: [],
  loading: false,
  loaded: false,
  load: async () => {
    set({ loading: true });
    const items = await getGroups();
    set({ items, loaded: true, loading: false });
  },
  add: async (name) => {
    const created = await createGroup(name);
    set({ items: [...get().items, created] });
    return created;
  },
  rename: async (currentName, nextName) => {
    const updated = await renameGroup(currentName, nextName);
    set({
      items: get().items.map((item) =>
        item.name === currentName ? updated : item,
      ),
    });
    return updated;
  },
  remove: async (name) => {
    await deleteGroup(name);
    set({ items: get().items.filter((item) => item.name !== name) });
  },
}));
