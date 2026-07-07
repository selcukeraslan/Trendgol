// Kimlik doğrulama servisi — Supabase Auth üzerinden.
// authStore bu servisi çağırır; içerik değişse de imzalar sabittir.

import type { User } from "@supabase/supabase-js";

import { getSupabase } from "@/lib/supabase/client";

export type UserRole = "admin" | "editor";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  user: AuthUser;
}

export interface Credentials {
  email: string;
  password: string;
}

function toAuthUser(user: User): AuthUser {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  // Rol app_metadata veya user_metadata'dan gelir; yoksa admin (tek-admin lig).
  const role = (appMeta.role ?? meta.role ?? "admin") as UserRole;
  const email = user.email ?? "";
  return {
    id: user.id,
    email,
    name: (meta.name as string) || email.split("@")[0] || "Yönetici",
    role,
  };
}

/** E-posta/şifre ile oturum açar. Hatalı bilgide hata fırlatır. */
export async function signIn(credentials: Credentials): Promise<AuthSession> {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email: credentials.email.trim(),
    password: credentials.password,
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Giriş başarısız.");
  return { user: toAuthUser(data.user) };
}

/** Oturumu kapatır. */
export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error(error.message);
}

/** Mevcut oturumu döner (yoksa null). */
export async function getSession(): Promise<AuthSession | null> {
  const { data } = await getSupabase().auth.getSession();
  const user = data.session?.user;
  return user ? { user: toAuthUser(user) } : null;
}
