// Site ayarları formu doğrulama şeması (iç içe contact objesi dahil).
import { z } from "zod";

export const settingsSchema = z.object({
  logoUrl: z.string().optional(),
  heroTitle: z.string().min(3, "Başlık gerekli."),
  heroSubtitle: z.string().min(3, "Alt başlık gerekli."),
  prizePool: z.string().min(1, "Ödül havuzu gerekli."),
  entryFee: z.string().min(1, "Katılım ücreti gerekli."),
  perMatchFee: z.string().min(1, "Maç başı ücret gerekli."),
  aboutText: z.string().min(10, "Hakkımızda metni gerekli."),
  // Formda her satır bir sponsor; kayıtta string[]'e dönüştürülür.
  sponsors: z.string().optional(),
  contact: z.object({
    phone: z.string().min(1, "Telefon gerekli."),
    email: z.string().email("Geçerli e-posta girin."),
    address: z.string().min(1, "Adres gerekli."),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
