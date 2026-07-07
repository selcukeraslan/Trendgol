// Supabase tarayıcı istemcisi (@supabase/ssr). Publishable (anon) key kullanır;
// auth session'ı çerezlerde tutar. Tembel oluşturulur — env eksikse yalnızca
// gerçekten kullanıldığında hata verir, import sırasında değil.

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env değişkenleri eksik: NEXT_PUBLIC_SUPABASE_URL ve " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (.env.local) ayarlayın.",
    );
  }

  client = createBrowserClient(url, key);
  return client;
}
