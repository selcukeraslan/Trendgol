import Link from "next/link";

import { cn } from "@/lib/utils";
import type { FormResult, Standing, Team } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamLogo } from "@/components/teams/team-logo";

const formStyles: Record<FormResult, string> = {
  W: "bg-emerald-500 text-white",
  D: "bg-muted-foreground/40 text-foreground",
  L: "bg-destructive text-white",
};
const formLabels: Record<FormResult, string> = { W: "G", D: "B", L: "M" };

/** Son 5 maç formu — renkli G/B/M rozetleri (eskiden yeniye). */
function FormPills({ form }: { form: FormResult[] }) {
  const last5 = form.slice(-5);
  if (last5.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <div className="flex items-center justify-center gap-1">
      {last5.map((result, i) => (
        <span
          key={i}
          title={formLabels[result]}
          className={cn(
            "flex size-5 items-center justify-center rounded text-[10px] font-bold",
            formStyles[result],
          )}
        >
          {formLabels[result]}
        </span>
      ))}
    </div>
  );
}

interface StandingsTableProps {
  standings: Standing[];
  teams: Team[];
  /** Özet görünüm: yalnızca temel sütunlar (landing için). */
  compact?: boolean;
  /** İlk N takımı altın/ödül bölgesi olarak vurgular. */
  prizeZone?: number;
}

export function StandingsTable({
  standings,
  teams,
  compact = false,
  prizeZone = 0,
}: StandingsTableProps) {
  const teamMap = new Map(teams.map((team) => [team.id, team]));

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Takım</TableHead>
            <TableHead className="text-center">O</TableHead>
            {!compact && (
              <>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">B</TableHead>
                <TableHead className="text-center">M</TableHead>
                <TableHead className="text-center">AG</TableHead>
                <TableHead className="text-center">YG</TableHead>
              </>
            )}
            <TableHead className="text-center">Av</TableHead>
            <TableHead className="text-center font-bold">P</TableHead>
            {!compact && (
              <TableHead className="hidden text-center md:table-cell">
                Form
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((row, index) => {
            const team = teamMap.get(row.teamId);
            const rank = index + 1;
            const inPrizeZone = prizeZone > 0 && rank <= prizeZone;
            return (
              <TableRow key={row.teamId} className="hover:bg-muted/30">
                <TableCell className="text-center font-medium tabular-nums">
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs",
                      inPrizeZone
                        ? "bg-gold/15 font-bold text-gold"
                        : "text-muted-foreground",
                    )}
                  >
                    {rank}
                  </span>
                </TableCell>
                <TableCell>
                  {team ? (
                    <Link
                      href={`/takimlar/${team.id}`}
                      className="flex items-center gap-2.5 font-medium transition-colors hover:text-brand"
                    >
                      <TeamLogo team={team} size="sm" />
                      <span className="line-clamp-1">{row.teamName}</span>
                    </Link>
                  ) : (
                    <span className="font-medium">{row.teamName}</span>
                  )}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {row.played}
                </TableCell>
                {!compact && (
                  <>
                    <TableCell className="text-center tabular-nums">
                      {row.won}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {row.drawn}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {row.lost}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {row.goalsFor}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {row.goalsAgainst}
                    </TableCell>
                  </>
                )}
                <TableCell className="text-center tabular-nums">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </TableCell>
                <TableCell className="text-center font-bold tabular-nums text-brand">
                  {row.points}
                </TableCell>
                {!compact && (
                  <TableCell className="hidden md:table-cell">
                    <FormPills form={row.form} />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
