import type { SiteSettings } from "@/types";
import settingsSeed from "@/data/settings.json";
import { readSingle, writeSingle } from "./base";

const SETTINGS_KEY = "settings";

export async function getSiteSettings(): Promise<SiteSettings> {
  return readSingle<SiteSettings>(SETTINGS_KEY, settingsSeed as SiteSettings);
}

/** Site ayarlarını günceller (iletişim alt alanı dahil sığ birleştirme). */
export async function updateSiteSettings(
  input: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = readSingle<SiteSettings>(
    SETTINGS_KEY,
    settingsSeed as SiteSettings,
  );
  const next: SiteSettings = {
    ...current,
    ...input,
    contact: { ...current.contact, ...(input.contact ?? {}) },
  };
  writeSingle(SETTINGS_KEY, next);
  return next;
}
