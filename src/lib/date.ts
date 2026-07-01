import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

/** "6 Haziran 2026 Cumartesi" — fikstür detayı için. */
export function formatMatchDate(iso: string): string {
  return format(parseISO(iso), "d MMMM yyyy EEEE", { locale: tr });
}

/** "6 Haz 2026" — kısa tarih. */
export function formatShortDate(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy", { locale: tr });
}

/** "6 Haziran 2026" — blog yayın tarihi. */
export function formatBlogDate(iso: string): string {
  return format(parseISO(iso), "d MMMM yyyy", { locale: tr });
}

/** Tarih (kısa) + saat birleşimi, ör. "6 Haz 2026 · 20:30". */
export function formatDateWithTime(iso: string, time: string): string {
  return `${formatShortDate(iso)} · ${time}`;
}
