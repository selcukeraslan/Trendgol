// Halı saha ligi veri modelleri — tek kaynak.
// Not: Alan isimleri İngilizce, kullanıcıya görünen içerik (mock data) Türkçedir.

/** Maç durumu. Görünen etiketler UI tarafında Türkçeye çevrilir. */
export type MatchStatus = "scheduled" | "played" | "postponed";

/** Oyuncu mevkii. */
export type PlayerPosition = "goalkeeper" | "defender" | "midfielder" | "forward";

export interface Team {
  id: string;
  name: string;
  /** Mock görsel / placeholder URL. */
  logoUrl?: string;
  /** Hex renk — kart vurgusu. */
  color: string;
  captain: string;
  description: string;
  photoUrl?: string;
  createdAt: string; // ISO
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number?: number;
  position?: PlayerPosition;
  goals?: number;
}

export interface Match {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  date: string; // ISO
  time: string; // "20:30"
  venue: string;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
}

/** Maç skorlarından türetilir; depolanmaz. */
export interface Standing {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown / düz metin içerik. */
  content: string;
  coverImageUrl?: string;
  category: string;
  author: string;
  publishedAt: string; // ISO
  featured: boolean;
  published: boolean;
}

export interface SiteContact {
  phone: string;
  email: string;
  address: string;
  instagram?: string;
  whatsapp?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  /** Görüntülenecek biçimlendirilmiş değerler, ör. "50.000 ₺". */
  prizePool: string;
  entryFee: string;
  perMatchFee: string;
  aboutText: string;
  contact: SiteContact;
}
