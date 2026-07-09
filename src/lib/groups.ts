import type { Match, Team } from "@/types";

/** Bir takım grubunun anahtarı. "none" = grupsuz. */
export type GroupKey = "A" | "B" | "none";

/** Bir maç grubunun anahtarı. "cross" = farklı gruplardan takımlar. */
export type MatchGroupKey = GroupKey | "cross";

const GROUP_LABELS: Record<MatchGroupKey, string> = {
  A: "A Grubu",
  B: "B Grubu",
  none: "Grupsuz",
  cross: "Gruplar arası",
};

/** Sıralı gösterim düzeni. */
const GROUP_ORDER: MatchGroupKey[] = ["A", "B", "none", "cross"];

export function groupLabel(key: MatchGroupKey): string {
  return GROUP_LABELS[key];
}

/** Herhangi bir takıma grup atanmış mı? */
export function hasGroups(teams: Team[]): boolean {
  return teams.some((t) => t.group);
}

export interface TeamGroupBucket {
  key: GroupKey;
  label: string;
  teams: Team[];
}

/**
 * Takımları gruplara böler. Hiç grup yoksa tek "tümü" kovası döner (başlıksız).
 * Grup varsa A, B ve (varsa) Grupsuz kovaları — yalnızca dolu olanlar.
 */
export function groupTeams(teams: Team[]): TeamGroupBucket[] {
  if (!hasGroups(teams)) {
    return [{ key: "none", label: "", teams }];
  }
  const buckets: TeamGroupBucket[] = [];
  const a = teams.filter((t) => t.group === "A");
  const b = teams.filter((t) => t.group === "B");
  const none = teams.filter((t) => !t.group);
  if (a.length) buckets.push({ key: "A", label: GROUP_LABELS.A, teams: a });
  if (b.length) buckets.push({ key: "B", label: GROUP_LABELS.B, teams: b });
  if (none.length) {
    buckets.push({ key: "none", label: GROUP_LABELS.none, teams: none });
  }
  return buckets;
}

/** Bir maçın grubunu takımlarından türetir. */
export function matchGroupKey(
  match: Match,
  teamById: Map<string, Team>,
): MatchGroupKey {
  const home = teamById.get(match.homeTeamId)?.group;
  const away = teamById.get(match.awayTeamId)?.group;
  if (home && away && home === away) return home;
  if (!home && !away) return "none";
  return "cross";
}

export interface MatchGroupBucket {
  key: MatchGroupKey;
  label: string;
  matches: Match[];
}

/**
 * Maçları gruba göre böler (gösterim sırasıyla). Hiç grup yoksa tek başlıksız
 * kova döner.
 */
export function groupMatches(
  matches: Match[],
  teams: Team[],
): MatchGroupBucket[] {
  if (!hasGroups(teams)) {
    return [{ key: "none", label: "", matches }];
  }
  const teamById = new Map(teams.map((t) => [t.id, t]));
  const map = new Map<MatchGroupKey, Match[]>();
  for (const match of matches) {
    const key = matchGroupKey(match, teamById);
    const list = map.get(key) ?? [];
    list.push(match);
    map.set(key, list);
  }
  return GROUP_ORDER.filter((key) => map.has(key)).map((key) => ({
    key,
    label: GROUP_LABELS[key],
    matches: map.get(key) ?? [],
  }));
}
