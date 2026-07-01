"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useSettingsStore } from "@/store/settingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

const settingsSchema = z.object({
  heroTitle: z.string().min(3, "Başlık gerekli."),
  heroSubtitle: z.string().min(3, "Alt başlık gerekli."),
  prizePool: z.string().min(1, "Ödül havuzu gerekli."),
  entryFee: z.string().min(1, "Katılım ücreti gerekli."),
  perMatchFee: z.string().min(1, "Maç başı ücret gerekli."),
  aboutText: z.string().min(10, "Hakkımızda metni gerekli."),
  contact: z.object({
    phone: z.string().min(1, "Telefon gerekli."),
    email: z.string().email("Geçerli e-posta girin."),
    address: z.string().min(1, "Adres gerekli."),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const emptyDefaults: SettingsFormValues = {
  heroTitle: "",
  heroSubtitle: "",
  prizePool: "",
  entryFee: "",
  perMatchFee: "",
  aboutText: "",
  contact: { phone: "", email: "", address: "", instagram: "", whatsapp: "" },
};

export default function AdminSettingsPage() {
  const load = useSettingsStore((s) => s.load);
  const loaded = useSettingsStore((s) => s.loaded);
  const settings = useSettingsStore((s) => s.settings);
  const save = useSettingsStore((s) => s.save);

  React.useEffect(() => {
    void load();
  }, [load]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: emptyDefaults,
  });

  React.useEffect(() => {
    if (settings) {
      form.reset({
        ...settings,
        contact: {
          phone: settings.contact.phone,
          email: settings.contact.email,
          address: settings.contact.address,
          instagram: settings.contact.instagram ?? "",
          whatsapp: settings.contact.whatsapp ?? "",
        },
      });
    }
  }, [settings, form]);

  async function onSubmit(values: SettingsFormValues) {
    await save(values);
    toast.success("Ayarlar kaydedildi.");
  }

  if (!loaded) {
    return <LoadingSkeleton count={8} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Site Ayarları
        </h1>
        <p className="text-sm text-muted-foreground">
          Ana sayfa içeriği, ücretler ve iletişim bilgilerini düzenleyin.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Ana sayfa */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Ana Sayfa</h2>
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Başlığı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Alt Başlığı</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Ücretler */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Ücretler & Ödül</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="prizePool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ödül Havuzu</FormLabel>
                    <FormControl>
                      <Input placeholder="50.000 ₺" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Katılım Ücreti</FormLabel>
                    <FormControl>
                      <Input placeholder="2.500 ₺" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perMatchFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maç Başı Ücret</FormLabel>
                    <FormControl>
                      <Input placeholder="150 ₺" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <Separator />

          {/* Hakkımızda */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Hakkımızda</h2>
            <FormField
              control={form.control}
              name="aboutText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hakkımızda Metni</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* İletişim */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">İletişim</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contact.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contact.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram (opsiyonel)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (opsiyonel)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://wa.me/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <Button type="submit" size="lg">
            Ayarları Kaydet
          </Button>
        </form>
      </Form>
    </div>
  );
}
