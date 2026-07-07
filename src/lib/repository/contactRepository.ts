// İletişim/başvuru mesajı gönderimi — Supabase `contact_messages` tablosuna
// insert eder. RLS: herkes ekleyebilir, yalnızca giriş yapan okuyabilir.

import { getSupabase } from "@/lib/supabase/client";

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  teamName?: string;
  message: string;
}

export async function sendContactMessage(input: ContactMessage): Promise<void> {
  const { error } = await getSupabase().from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    team_name: input.teamName ?? null,
    message: input.message,
  });
  if (error) throw new Error(error.message);
}
