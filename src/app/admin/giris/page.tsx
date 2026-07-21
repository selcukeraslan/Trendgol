"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      // MOCK: boş olmayan bilgi kabul edilir. Faz 4'te Supabase Auth'a bağlanır.
      await login(values);
      router.replace("/admin");
    } catch {
      form.setError("password", {
        message: "Giriş başarısız. Bilgileri kontrol edin.",
      });
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 className="font-heading text-xl font-bold tracking-tight">
            Yönetim Girişi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Devam etmek için giriş yapın.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@trendgoligi.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full">
              Giriş Yap
            </Button>
          </form>
        </Form>

        <p className="mt-5 rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
          Demo modu: Geçerli bir e-posta ve herhangi bir şifre ile giriş
          yapabilirsiniz. Gerçek kimlik doğrulama yakında (Supabase).
        </p>
      </div>
    </div>
  );
}
