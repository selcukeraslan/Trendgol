// Site ayarları formu doğrulama şeması (iç içe contact objesi dahil).
import { z } from "zod";

const infoCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  hint: z.string(),
  icon: z.enum(["users", "trophy", "award", "wallet", "coins", "target"]),
  valueSource: z.enum([
    "custom",
    "teamCount",
    "entryFee",
    "perMatchFee",
    "prizePool",
  ]),
  highlighted: z.boolean(),
});

// Tüm alanlar opsiyoneldir; boş bırakılanlar için arayüzde makul varsayılanlar
// gösterilir. E-posta yalnızca doldurulduğunda format doğrulaması yapılır.
export const settingsSchema = z.object({
  logoUrl: z.string().optional(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  prizePool: z.string(),
  entryFee: z.string(),
  perMatchFee: z.string(),
  aboutText: z.string(),
  aboutEyebrow: z.string(),
  aboutTitle: z.string(),
  aboutSubtitle: z.string(),
  aboutStoryTitle: z.string(),
  aboutStoryCards: z.array(infoCardSchema),
  aboutMissionTitle: z.string(),
  aboutMissionText: z.string(),
  aboutValuesTitle: z.string(),
  aboutValues: z.array(z.object({ title: z.string(), text: z.string() })),
  aboutCtaTitle: z.string(),
  aboutCtaText: z.string(),
  aboutCtaButtonLabel: z.string(),
  // Formda her satır bir sponsor; kayıtta string[]'e dönüştürülür.
  sponsors: z.string().optional(),
  contact: z.object({
    phone: z.string(),
    email: z.string().email("Geçerli e-posta girin.").or(z.literal("")),
    address: z.string(),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
  mapEmbedUrl: z
    .string()
    .url("Geçerli bir Google Maps bağlantısı girin.")
    .or(z.literal(""))
    .optional(),
  // Kurallar PDF'inin URL'i (dosya yüklemeden gelir).
  rulesPdfUrl: z.string().optional(),
  // Her satır bir madde; kayıtta string[]'e dönüştürülür.
  participationTerms: z.string().optional(),
  participationCards: z.array(infoCardSchema),
  // Nasıl Katılırım adımları (ikonlar sabit, başlık/metin düzenlenir).
  howToJoinSteps: z.array(z.object({ title: z.string(), text: z.string() })),
  ctaTitle: z.string(),
  ctaText: z.string(),
  footerDescription: z.string(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
