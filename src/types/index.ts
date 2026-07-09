// Halı saha ligi veri modelleri — tek kaynak.
// Not: Alan isimleri İngilizce, kullanıcıya görünen içerik (mock data) Türkçedir.

/** Maç durumu. Görünen etiketler UI tarafında Türkçeye çevrilir. */
export type MatchStatus = "scheduled" | "played" | "postponed";

/** Oyuncu mevkii. */
export type PlayerPosition = "goalkeeper" | "defender" | "midfielder" | "forward";

/** Turnuva grubu. Atanmamışsa (undefined) takım grupsuzdur. */
export type TeamGroup = "A" | "B";

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
  /** A veya B grubu; boşsa grupsuz. */
  group?: TeamGroup;
  createdAt: string; // ISO
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number?: number;
  position?: PlayerPosition;
}

/** Bir maçta bir oyuncunun attığı gol sayısı. */
export interface MatchScorer {
  playerId: string;
  goals: number;
}

/** Kart türü. */
export type CardType = "yellow" | "red";

/** Bir maçta bir oyuncunun gördüğü kart (her satır tek kart). */
export interface CardRecord {
  playerId: string;
  type: CardType;
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
  /** Maçta gol atan oyuncular. Gol krallığı bundan türetilir. */
  scorers?: MatchScorer[];
  /** Maçta kart gören oyuncular. Kart istatistikleri bundan türetilir. */
  cards?: CardRecord[];
}

/** Maç golcülerinden türetilir; depolanmaz. */
export interface TopScorer {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  goals: number;
}

/** Maç kartlarından türetilir; depolanmaz. */
export interface PlayerCardStat {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  yellow: number;
  red: number;
}

/** Tek maç sonucu (form için). W: galibiyet, D: beraberlik, L: mağlubiyet. */
export type FormResult = "W" | "D" | "L";

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
  /** Kronolojik sıra (eskiden yeniye) tüm maç sonuçları; tabloda son 5 gösterilir. */
  form: FormResult[];
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

/** "Nasıl Katılırım" adımı (ikon sabittir, başlık/metin düzenlenebilir). */
export interface HowToJoinStep {
  title: string;
  text: string;
}

export interface SiteSettings {
  /** Site logosu görsel URL'i. Boşsa "HS" rozeti gösterilir. */
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  /** Görüntülenecek biçimlendirilmiş değerler, ör. "50.000 ₺". */
  prizePool: string;
  entryFee: string;
  perMatchFee: string;
  aboutText: string;
  contact: SiteContact;
  /** Sponsor / iş ortağı adları — ana sayfada gösterilir. */
  sponsors: string[];
  /** Kurallar PDF'inin public URL'i. Boşsa "Kuralları İncele" linki gizlenir. */
  rulesPdfUrl?: string;
  /** Ana sayfa "Katılım Şartları" maddeleri. Boşsa varsayılanlar gösterilir. */
  participationTerms: string[];
  /** "Nasıl Katılırım" adımları. Boşsa varsayılanlar gösterilir. */
  howToJoinSteps: HowToJoinStep[];
  /** Alt CTA bölümü başlığı ve metni. Boşsa varsayılanlar gösterilir. */
  ctaTitle: string;
  ctaText: string;
  /** Footer tanıtım metni. Boşsa varsayılan gösterilir. */
  footerDescription: string;
}
