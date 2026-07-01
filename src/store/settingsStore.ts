import { create } from "zustand";

import type { SiteSettings } from "@/types";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/repository/settingsRepository";

interface SettingsStoreState {
  settings: SiteSettings | null;
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  save: (input: Partial<SiteSettings>) => Promise<SiteSettings>;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  settings: null,
  loading: false,
  loaded: false,
  load: async () => {
    set({ loading: true });
    const settings = await getSiteSettings();
    set({ settings, loaded: true, loading: false });
  },
  save: async (input) => {
    const settings = await updateSiteSettings(input);
    set({ settings });
    return settings;
  },
}));
