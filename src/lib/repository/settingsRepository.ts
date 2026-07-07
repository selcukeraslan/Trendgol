import type { SiteContact, SiteSettings } from "@/types";
import { getSupabase } from "@/lib/supabase/client";

const TABLE = "site_settings";
const SETTINGS_ID = "default";

interface SettingsRow {
  id: string;
  logo_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  prize_pool: string;
  entry_fee: string;
  per_match_fee: string;
  about_text: string;
  contact: SiteContact;
  sponsors: string[] | null;
}

function fromRow(r: SettingsRow): SiteSettings {
  return {
    logoUrl: r.logo_url ?? undefined,
    heroTitle: r.hero_title,
    heroSubtitle: r.hero_subtitle,
    prizePool: r.prize_pool,
    entryFee: r.entry_fee,
    perMatchFee: r.per_match_fee,
    aboutText: r.about_text,
    contact: r.contact,
    sponsors: r.sponsors ?? [],
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("id", SETTINGS_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(
      "Site ayarları bulunamadı. Seed script'ini çalıştırdınız mı?",
    );
  }
  return fromRow(data as SettingsRow);
}

/** Site ayarlarını günceller (tekil 'default' satırı). */
export async function updateSiteSettings(
  input: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const patch: Record<string, unknown> = {};
  if (input.logoUrl !== undefined) patch.logo_url = input.logoUrl || null;
  if (input.heroTitle !== undefined) patch.hero_title = input.heroTitle;
  if (input.heroSubtitle !== undefined)
    patch.hero_subtitle = input.heroSubtitle;
  if (input.prizePool !== undefined) patch.prize_pool = input.prizePool;
  if (input.entryFee !== undefined) patch.entry_fee = input.entryFee;
  if (input.perMatchFee !== undefined) patch.per_match_fee = input.perMatchFee;
  if (input.aboutText !== undefined) patch.about_text = input.aboutText;
  if (input.contact !== undefined) patch.contact = input.contact;
  if (input.sponsors !== undefined) patch.sponsors = input.sponsors;

  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(patch)
    .eq("id", SETTINGS_ID)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as SettingsRow);
}
