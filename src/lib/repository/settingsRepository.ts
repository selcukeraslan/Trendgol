import type { HowToJoinStep, SiteContact, SiteSettings } from "@/types";
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
  rules_pdf_url: string | null;
  participation_terms: string[] | null;
  how_to_join_steps: HowToJoinStep[] | null;
  cta_title: string | null;
  cta_text: string | null;
  footer_description: string | null;
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
    rulesPdfUrl: r.rules_pdf_url ?? undefined,
    participationTerms: r.participation_terms ?? [],
    howToJoinSteps: r.how_to_join_steps ?? [],
    ctaTitle: r.cta_title ?? "",
    ctaText: r.cta_text ?? "",
    footerDescription: r.footer_description ?? "",
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
  if (input.rulesPdfUrl !== undefined)
    patch.rules_pdf_url = input.rulesPdfUrl || null;
  if (input.participationTerms !== undefined)
    patch.participation_terms = input.participationTerms;
  if (input.howToJoinSteps !== undefined)
    patch.how_to_join_steps = input.howToJoinSteps;
  if (input.ctaTitle !== undefined) patch.cta_title = input.ctaTitle;
  if (input.ctaText !== undefined) patch.cta_text = input.ctaText;
  if (input.footerDescription !== undefined)
    patch.footer_description = input.footerDescription;

  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(patch)
    .eq("id", SETTINGS_ID)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as SettingsRow);
}
