// Takım formu doğrulama şeması. Tek kaynak — form bileşenleri buradan import eder.
import { z } from "zod";

// Yalnızca takım adı zorunludur; diğer alanlar opsiyoneldir.
export const teamSchema = z.object({
  name: z.string().min(1, "Takım adı gerekli."),
  captain: z.string(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Geçerli bir renk seçin.")
    .or(z.literal("")),
  description: z.string(),
  logoUrl: z.string().optional(),
  photoUrl: z.string().optional(),
  // "" = grupsuz.
  group: z.enum(["A", "B"]).or(z.literal("")),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
