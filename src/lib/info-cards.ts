import type {
  InfoCard,
  InfoCardIcon,
  InfoCardValueSource,
  SiteSettings,
} from "@/types";

export const INFO_CARD_ICON_OPTIONS: Array<{
  value: InfoCardIcon;
  label: string;
}> = [
  { value: "users", label: "Takım" },
  { value: "trophy", label: "Kupa" },
  { value: "award", label: "Madalya" },
  { value: "wallet", label: "Cüzdan" },
  { value: "coins", label: "Ücret" },
  { value: "target", label: "Hedef" },
];

export const INFO_CARD_SOURCE_OPTIONS: Array<{
  value: InfoCardValueSource;
  label: string;
}> = [
  { value: "custom", label: "Elle girilen değer" },
  { value: "teamCount", label: "Kayıtlı takım sayısı" },
  { value: "entryFee", label: "Katılım ücreti" },
  { value: "perMatchFee", label: "Maç başı ücret" },
  { value: "prizePool", label: "Ödül havuzu" },
];

export const EMPTY_INFO_CARD: InfoCard = {
  label: "Yeni Kart",
  value: "",
  hint: "",
  icon: "target",
  valueSource: "custom",
  highlighted: false,
};

export function resolveInfoCardValue(
  card: InfoCard,
  settings: SiteSettings | undefined,
  teamCount: number,
): string {
  switch (card.valueSource) {
    case "teamCount":
      return teamCount > 0 ? String(teamCount) : "—";
    case "entryFee":
      return settings?.entryFee || "—";
    case "perMatchFee":
      return settings?.perMatchFee || "—";
    case "prizePool":
      return settings?.prizePool || "—";
    default:
      return card.value.trim() || "—";
  }
}
