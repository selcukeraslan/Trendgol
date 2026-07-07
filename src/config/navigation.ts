// Public site + admin navigasyon yapılandırması.
// Not: Etiketler ve route slug'ları Türkçe; kod isimleri İngilizce.

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ListOrdered,
  Newspaper,
  Settings,
} from "lucide-react";

export interface NavItem {
  /** Menüde görünen Türkçe etiket. */
  label: string;
  /** Türkçe route slug'ı. */
  href: string;
}

export interface AdminNavItem extends NavItem {
  icon: LucideIcon;
}

export const publicNavItems: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Fikstür", href: "/fikstur" },
  { label: "Puan Durumu", href: "/puan-durumu" },
  { label: "Gol Krallığı", href: "/gol-krali" },
  { label: "Takımlar", href: "/takimlar" },
  { label: "Blog", href: "/blog" },
  { label: "Biz Kimiz", href: "/biz-kimiz" },
  { label: "İletişim", href: "/iletisim" },
];

export const adminNavItems: AdminNavItem[] = [
  { label: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
  { label: "Fikstür", href: "/admin/fikstur", icon: CalendarDays },
  { label: "Takımlar", href: "/admin/takimlar", icon: Users },
  { label: "Puan Durumu", href: "/admin/puan-durumu", icon: ListOrdered },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Site Ayarları", href: "/admin/ayarlar", icon: Settings },
];

/** Site adı — header/footer'da kullanılır. */
export const siteName = "TrendgoLig";
