// Public iletişim formu doğrulama şeması.
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Lütfen adınızı girin."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  phone: z.string().optional(),
  teamName: z.string().optional(),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalı."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
