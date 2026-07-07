"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { settingsSchema, type SettingsFormValues } from "@/schemas/settings";
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
import { ImageUpload } from "@/components/common/image-upload";

const emptyDefaults: SettingsFormValues = {
  logoUrl: "",
  heroTitle: "",
  heroSubtitle: "",
  prizePool: "",
  entryFee: "",
  perMatchFee: "",
  aboutText: "",
  sponsors: "",
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
        logoUrl: settings.logoUrl ?? "",
        sponsors: (settings.sponsors ?? []).join("\n"),
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
    const { sponsors, ...rest } = values;
    await save({
      ...rest,
      sponsors: (sponsors ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
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
          {/* Site logosu */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Site Logosu</h2>
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="logos"
                      alt="Site logosu önizleme"
                      previewClassName="h-20 w-20"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Navbar ve alt bilgide görünür. Boş bırakılırsa
                    &quot;HS&quot; rozeti gösterilir. Kare/şeffaf PNG önerilir.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

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

          {/* Sponsorlar */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Sponsorlar</h2>
            <FormField
              control={form.control}
              name="sponsors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Listesi</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={"Her satıra bir sponsor adı\nÖrn. SPOR A.Ş."}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Her satır bir sponsor olarak ana sayfada gösterilir. Boş
                    bırakılırsa sponsor alanı gizlenir.
                  </p>
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
