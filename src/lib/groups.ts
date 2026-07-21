import type { Match, Team } from "@/types";

const NO_GROUP_KEY = "__ungrouped__";
const CROSS_GROUP_KEY = "__cross_group__";

/** Dinamik grup adı veya sistemin özel grup anahtarı. */
export type GroupKey = string;
export type MatchGroupKey = string;

function assignedGroupNames(teams: Team[]): string[] {
  return [...new Set(teams.flatMap((team) => (team.group ? [team.group] : [])))]
    .sort((a, b) => a.localeCompare(b, "tr"));
}

export function groupLabel(key: MatchGroupKey): string {
  if (key === NO_GROUP_KEY) return "Grupsuz";
  if (key === CROSS_GROUP_KEY) return "Gruplar arası";
  // Eski A/B verisinin görünümünü koru; özel adları olduğu gibi göster.
  return /^[A-Z]$/.test(key) ? `${key} Grubu` : key;
}

/** Herhangi bir takıma grup atanmış mı? */
export function hasGroups(teams: Team[]): boolean {
  return teams.some((team) => Boolean(team.group));
}

export interface TeamGroupBucket {
  key: GroupKey;
  label: string;
  teams: Team[];
}

/** Takımları kullanıcı tarafından oluşturulan grup adlarına göre böler. */
export function groupTeams(teams: Team[]): TeamGroupBucket[] {
  if (!hasGroups(teams)) {
    return [{ key: NO_GROUP_KEY, label: "", teams }];
  }

  const buckets = assignedGroupNames(teams).map((name) => ({
    key: name,
    label: groupLabel(name),
    teams: teams.filter((team) => team.group === name),
  }));
  const ungrouped = teams.filter((team) => !team.group);

  if (ungrouped.length > 0) {
    buckets.push({
      key: NO_GROUP_KEY,
      label: groupLabel(NO_GROUP_KEY),
      teams: ungrouped,
    });
  }
  return buckets;
}

/** Bir maçın grubunu iki takımın atamasından türetir. */
export function matchGroupKey(
  match: Match,
  teamById: Map<string, Team>,
): MatchGroupKey {
  const home = teamById.get(match.homeTeamId)?.group;
  const away = teamById.get(match.awayTeamId)?.group;
  if (home && away && home === away) return home;
  if (!home && !away) return NO_GROUP_KEY;
  return CROSS_GROUP_KEY;
}

export interface MatchGroupBucket {
  key: MatchGroupKey;
  label: string;
  matches: Match[];
}

/** Maçları dinamik gruplara, grupsuzlara ve gruplar arası maçlara böler. */
export function groupMatches(
  matches: Match[],
  teams: Team[],
): MatchGroupBucket[] {
  if (!hasGroups(teams)) {
    return [{ key: NO_GROUP_KEY, label: "", matches }];
  }

  const teamById = new Map(teams.map((team) => [team.id, team]));
  const grouped = new Map<MatchGroupKey, Match[]>();
  for (const match of matches) {
    const key = matchGroupKey(match, teamById);
    grouped.set(key, [...(grouped.get(key) ?? []), match]);
  }

  const order = [
    ...assignedGroupNames(teams),
    NO_GROUP_KEY,
    CROSS_GROUP_KEY,
  ];
  return order
    .filter((key) => grouped.has(key))
    .map((key) => ({
      key,
      label: groupLabel(key),
      matches: grouped.get(key) ?? [],
    }));
}
