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
  // "" = grupsuz; diğer değerler adminin oluşturduğu grup adlarıdır.
  group: z.string().max(80, "Grup adı en fazla 80 karakter olabilir."),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
