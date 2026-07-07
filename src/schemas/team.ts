// Takım formu doğrulama şeması. Tek kaynak — form bileşenleri buradan import eder.
import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "Takım adı en az 2 karakter olmalı."),
  captain: z.string().min(2, "Kaptan adı gerekli."),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Geçerli bir renk seçin."),
  description: z.string().min(5, "Kısa bir açıklama girin."),
  logoUrl: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
