// Blog yazısı formu doğrulama şeması.
import { z } from "zod";

// Başlık ve slug yönlendirme/benzersizlik için gereklidir; diğer alanlar opsiyonel.
export const blogSchema = z.object({
  title: z.string().min(1, "Başlık gerekli."),
  slug: z.string().min(1, "Slug gerekli."),
  excerpt: z.string(),
  content: z.string(),
  category: z.string(),
  author: z.string(),
  coverImageUrl: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
