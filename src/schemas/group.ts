import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Grup adı gerekli.")
    .max(80, "Grup adı en fazla 80 karakter olabilir."),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
