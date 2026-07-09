// Ayarlardan boş bırakılan içerik blokları için varsayılan metinler.
// Hem public bileşenler (fallback) hem admin formu (ön dolum) buradan okur.

import type { HowToJoinStep } from "@/types";

export const DEFAULT_PARTICIPATION_TERMS = [
  "Her takım en az 7 oyuncudan oluşmalı.",
  "Katılım ücreti sezon başında ödenir.",
  "Maç başı ücret her karşılaşmadan önce tahsil edilir.",
  "Tüm maçlar lig kurallarına göre oynanır.",
];

export const DEFAULT_HOW_TO_JOIN_STEPS: HowToJoinStep[] = [
  { title: "Başvur", text: "İletişim formundan takımını ve kadronu bize ilet." },
  { title: "Takımını Kur", text: "Kadronu tamamla, kaptanını belirle ve hazır ol." },
  { title: "Katılımı Tamamla", text: "Katılım ücretini öde, fikstürdeki yerini al." },
  { title: "Sahaya Çık", text: "Maçlarını oyna, puanları topla, ödüle koş." },
];

export const DEFAULT_CTA_TITLE = "Şampiyonluk yolundaki yerini al";
export const DEFAULT_CTA_TEXT =
  "Kontenjanlar dolmadan takımını kaydet, ödüllü ligin bir parçası ol.";

export const DEFAULT_FOOTER_DESCRIPTION =
  "Ücretli katılımlı, para ödüllü halı saha futbol ligi. Takımını kur, sahaya çık, ödülü kap.";
