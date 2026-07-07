"use client";

import Link from "next/link";
import { AtSign, Mail, MessageCircle, Phone } from "lucide-react";

import type { SiteSettings } from "@/types";
import { getSiteSettings } from "@/lib/repository/settingsRepository";
import { useAsyncData } from "@/hooks/use-async-data";
import { Container } from "@/components/common/container";
import { publicNavItems, siteName } from "@/config/navigation";

export function Footer() {
  const year = 2026;
  const { data } = useAsyncData<SiteSettings>(() => getSiteSettings(), []);
  const contact = data?.contact;

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marka */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-heading">
              {data?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.logoUrl}
                  alt={siteName}
                  className="size-8 rounded-md object-cover"
                />
              ) : (
                <span className="flex size-8 items-center justify-center rounded-md bg-brand font-bold text-brand-foreground">
                  HS
                </span>
              )}
              <span className="text-lg font-bold tracking-tight">
                {siteName}
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Ücretli katılımlı, para ödüllü halı saha futbol ligi. Takımını kur,
              sahaya çık, ödülü kap.
            </p>
          </div>

          {/* Menü */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
              Menü
            </h3>
            <ul className="space-y-2">
              {publicNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
              İletişim
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {contact?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-brand" aria-hidden="true" />
                  <span>{contact.phone}</span>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-brand" aria-hidden="true" />
                  <span>{contact.email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Sosyal */}
          {(contact?.instagram || contact?.whatsapp) && (
            <div className="space-y-3">
              <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
                Bizi Takip Et
              </h3>
              <div className="flex flex-col gap-2">
                {contact?.instagram && (
                  <Link
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <AtSign className="size-4" aria-hidden="true" />
                    <span>Instagram</span>
                  </Link>
                )}
                {contact?.whatsapp && (
                  <Link
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
          © {year} {siteName}. Tüm hakları saklıdır.
        </div>
      </Container>
    </footer>
  );
}
