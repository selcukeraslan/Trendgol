// Oyuncu formu doğrulama şeması. Sayısal alanlar formda string olarak tutulur.
import { z } from "zod";

// Not: Goller maç golcü kayıtlarından türetilir, oyuncuda tutulmaz.
export const playerSchema = z.object({
  name: z.string().min(2, "Oyuncu adı gerekli."),
  number: z.string().optional(),
  position: z.string().optional(),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
