"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { UserRole } from "@/lib/auth/authService";
import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Verilirse yalnızca bu role sahip kullanıcı erişebilir. */
  requiredRole?: UserRole;
}

/**
 * Admin sayfalarını korur. Oturum yoksa giriş sayfasına yönlendirir.
 * MOCK auth (authService) üzerinden çalışır; Faz 4'te Supabase oturumuna bağlanır.
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);

  // Oturumu tarayıcıda bir kez yükle.
  React.useEffect(() => {
    if (!hasHydrated) void hydrate();
  }, [hasHydrated, hydrate]);

  const roleAllowed = !requiredRole || user?.role === requiredRole;

  React.useEffect(() => {
    if (hasHydrated && (!isAuthenticated || !roleAllowed)) {
      router.replace("/admin/giris");
    }
  }, [hasHydrated, isAuthenticated, roleAllowed, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated || !roleAllowed) return null;

  return <>{children}</>;
}
