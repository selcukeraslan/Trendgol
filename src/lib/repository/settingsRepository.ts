import type {
  AboutValue,
  HowToJoinStep,
  SiteContact,
  SiteSettings,
} from "@/types";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_ABOUT_VALUES,
} from "@/lib/content-defaults";
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
  about_eyebrow: string | null;
  about_title: string | null;
  about_subtitle: string | null;
  about_story_title: string | null;
  about_team_label: string | null;
  about_prize_pool_label: string | null;
  about_season: string | null;
  about_season_label: string | null;
  about_mission_title: string | null;
  about_mission_text: string | null;
  about_values_title: string | null;
  about_values: AboutValue[] | null;
  about_cta_title: string | null;
  about_cta_text: string | null;
  about_cta_button_label: string | null;
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
    aboutEyebrow: r.about_eyebrow ?? DEFAULT_ABOUT_CONTENT.eyebrow,
    aboutTitle: r.about_title ?? DEFAULT_ABOUT_CONTENT.title,
    aboutSubtitle: r.about_subtitle ?? DEFAULT_ABOUT_CONTENT.subtitle,
    aboutStoryTitle: r.about_story_title ?? DEFAULT_ABOUT_CONTENT.storyTitle,
    aboutTeamLabel: r.about_team_label ?? DEFAULT_ABOUT_CONTENT.teamLabel,
    aboutPrizePoolLabel:
      r.about_prize_pool_label ?? DEFAULT_ABOUT_CONTENT.prizePoolLabel,
    aboutSeason: r.about_season ?? DEFAULT_ABOUT_CONTENT.season,
    aboutSeasonLabel:
      r.about_season_label ?? DEFAULT_ABOUT_CONTENT.seasonLabel,
    aboutMissionTitle:
      r.about_mission_title ?? DEFAULT_ABOUT_CONTENT.missionTitle,
    aboutMissionText:
      r.about_mission_text ?? DEFAULT_ABOUT_CONTENT.missionText,
    aboutValuesTitle:
      r.about_values_title ?? DEFAULT_ABOUT_CONTENT.valuesTitle,
    aboutValues: DEFAULT_ABOUT_VALUES.map(
      (fallback, index) => r.about_values?.[index] ?? fallback,
    ),
    aboutCtaTitle: r.about_cta_title ?? DEFAULT_ABOUT_CONTENT.ctaTitle,
    aboutCtaText: r.about_cta_text ?? DEFAULT_ABOUT_CONTENT.ctaText,
    aboutCtaButtonLabel:
      r.about_cta_button_label ?? DEFAULT_ABOUT_CONTENT.ctaButtonLabel,
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
  if (input.aboutEyebrow !== undefined)
    patch.about_eyebrow = input.aboutEyebrow;
  if (input.aboutTitle !== undefined) patch.about_title = input.aboutTitle;
  if (input.aboutSubtitle !== undefined)
    patch.about_subtitle = input.aboutSubtitle;
  if (input.aboutStoryTitle !== undefined)
    patch.about_story_title = input.aboutStoryTitle;
  if (input.aboutTeamLabel !== undefined)
    patch.about_team_label = input.aboutTeamLabel;
  if (input.aboutPrizePoolLabel !== undefined)
    patch.about_prize_pool_label = input.aboutPrizePoolLabel;
  if (input.aboutSeason !== undefined) patch.about_season = input.aboutSeason;
  if (input.aboutSeasonLabel !== undefined)
    patch.about_season_label = input.aboutSeasonLabel;
  if (input.aboutMissionTitle !== undefined)
    patch.about_mission_title = input.aboutMissionTitle;
  if (input.aboutMissionText !== undefined)
    patch.about_mission_text = input.aboutMissionText;
  if (input.aboutValuesTitle !== undefined)
    patch.about_values_title = input.aboutValuesTitle;
  if (input.aboutValues !== undefined) patch.about_values = input.aboutValues;
  if (input.aboutCtaTitle !== undefined)
    patch.about_cta_title = input.aboutCtaTitle;
  if (input.aboutCtaText !== undefined)
    patch.about_cta_text = input.aboutCtaText;
  if (input.aboutCtaButtonLabel !== undefined)
    patch.about_cta_button_label = input.aboutCtaButtonLabel;
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
