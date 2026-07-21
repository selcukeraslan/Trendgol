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

export interface ContactMessageRecord extends ContactMessage {
  id: string;
  createdAt: string;
}

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  team_name: string | null;
  message: string;
  created_at: string;
}

function fromRow(row: ContactMessageRow): ContactMessageRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    teamName: row.team_name ?? undefined,
    message: row.message,
    createdAt: row.created_at,
  };
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

/** Başvuruları en yeniden eskiye döner. RLS gereği oturum açmış kullanıcı ister. */
export async function getContactMessages(): Promise<ContactMessageRecord[]> {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ContactMessageRow[]).map(fromRow);
}
