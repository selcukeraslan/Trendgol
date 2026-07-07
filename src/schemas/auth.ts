// Yönetim girişi formu doğrulama şeması (şimdilik mock auth ile kullanılır).
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(1, "Şifre gerekli."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
