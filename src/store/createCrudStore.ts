// Repository tabanlı koleksiyonlar için ortak Zustand CRUD store fabrikası.
// Store, listeyi bellekte tutar; mutasyonlar repository üzerinden localStorage'a
// yazılır ve store anında güncellenir (admin UI'da anlık yansıma).

import { create } from "zustand";

export interface CrudApi<T, CreateInput> {
  list: () => Promise<T[]>;
  create: (input: CreateInput) => Promise<T>;
  update: (id: string, input: Partial<CreateInput>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export interface CrudState<T, CreateInput> {
  items: T[];
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  add: (input: CreateInput) => Promise<T>;
  edit: (id: string, input: Partial<CreateInput>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function createCrudStore<T extends { id: string }, CreateInput>(
  api: CrudApi<T, CreateInput>,
) {
  return create<CrudState<T, CreateInput>>((set, get) => ({
    items: [],
    loading: false,
    loaded: false,
    load: async () => {
      set({ loading: true });
      const items = await api.list();
      set({ items, loaded: true, loading: false });
    },
    add: async (input) => {
      const created = await api.create(input);
      set({ items: [...get().items, created] });
      return created;
    },
    edit: async (id, input) => {
      const updated = await api.update(id, input);
      set({ items: get().items.map((item) => (item.id === id ? updated : item)) });
      return updated;
    },
    remove: async (id) => {
      await api.remove(id);
      set({ items: get().items.filter((item) => item.id !== id) });
    },
  }));
}
