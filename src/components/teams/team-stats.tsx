import type { Standing } from "@/types";

interface StatTileProps {
  label: string;
  value: number | string;
  highlight?: boolean;
}

function StatTile({ label, value, highlight }: StatTileProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <div
        className={
          "font-heading text-2xl font-bold tabular-nums " +
          (highlight ? "text-brand" : "")
        }
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

/** Takımın puan durumundan türetilen istatistik kartları. */
export function TeamStats({ standing }: { standing: Standing | undefined }) {
  const s: Standing = standing ?? {
    teamId: "",
    teamName: "",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile label="Oynanan" value={s.played} />
      <StatTile label="Galibiyet" value={s.won} />
      <StatTile label="Beraberlik" value={s.drawn} />
      <StatTile label="Mağlubiyet" value={s.lost} />
      <StatTile label="Attığı Gol" value={s.goalsFor} />
      <StatTile label="Yediği Gol" value={s.goalsAgainst} />
      <StatTile
        label="Averaj"
        value={s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
      />
      <StatTile label="Puan" value={s.points} highlight />
    </div>
  );
}
