// Blog yazısı formu doğrulama şeması.
import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Başlık gerekli."),
  slug: z.string().min(3, "Slug gerekli."),
  excerpt: z.string().min(10, "Özet en az 10 karakter."),
  content: z.string().min(20, "İçerik en az 20 karakter."),
  category: z.string().min(2, "Kategori gerekli."),
  author: z.string().min(2, "Yazar gerekli."),
  coverImageUrl: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
