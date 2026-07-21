"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import type { SiteSettings } from "@/types";
import { contactSchema, type ContactFormValues } from "@/schemas/contact";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { sendContactMessage } from "@/lib/repository/contactRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ContactPage() {
  const { data } = useAsyncData<SiteSettings>(() => getSiteSettings(), []);
  const contact = data?.contact;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      teamName: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      await sendContactMessage(values);
      toast.success("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");
      form.reset();
    } catch {
      toast.error("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  }

  const contactItems = [
    { icon: Phone, label: "Telefon", value: contact?.phone },
    { icon: Mail, label: "E-posta", value: contact?.email },
    { icon: MapPin, label: "Adres", value: contact?.address },
  ].filter((item) => item.value);

  return (
    <>
      <PageHeader
        eyebrow="Bize Ulaşın"
        title="İletişim"
        description="Takım başvurusu, sorular ve iş birlikleri için bizimle iletişime geçin."
      />

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        {/* İletişim bilgileri */}
        <div className="space-y-8">
          <div className="space-y-4">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sosyal */}
          {(contact?.instagram || contact?.whatsapp) && (
            <div className="flex gap-3">
              {contact?.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-brand/40"
                >
                  <AtSign className="size-4" aria-hidden="true" />
                  Instagram
                </a>
              )}
              {contact?.whatsapp && (
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-brand/40"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp
                </a>
              )}
            </div>
          )}

          {data?.mapEmbedUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/30">
              <iframe
                src={data.mapEmbedUrl}
                title="TrendgoLig konumu"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-7" aria-hidden="true" />
                Harita yakında eklenecek
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold tracking-tight">
            Takım Başvurusu / Mesaj
          </h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Formu doldurun, ekibimiz sizinle iletişime geçsin.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl>
                        <Input placeholder="Adınız Soyadınız" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ornek@eposta.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon (opsiyonel)</FormLabel>
                      <FormControl>
                        <Input placeholder="05XX XXX XX XX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Takım Adı (opsiyonel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Takımınızın adı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesajınız</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Bize iletmek istedikleriniz..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </form>
          </Form>
        </div>
      </Container>
    </>
  );
}
