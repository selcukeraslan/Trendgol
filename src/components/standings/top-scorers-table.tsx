import Link from "next/link";
import { Goal } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TopScorer } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopScorersTableProps {
  scorers: TopScorer[];
  /** İlk N golcüyü vurgular. */
  highlight?: number;
}

/** Gol krallığı tablosu — veriler maç golcü kayıtlarından türetilir. */
export function TopScorersTable({ scorers, highlight = 3 }: TopScorersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Oyuncu</TableHead>
            <TableHead>Takım</TableHead>
            <TableHead className="text-center font-bold">Gol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scorers.map((scorer, index) => {
            const rank = index + 1;
            const isTop = highlight > 0 && rank <= highlight;
            return (
              <TableRow key={scorer.playerId} className="hover:bg-muted/30">
                <TableCell className="text-center font-medium tabular-nums">
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs",
                      isTop
                        ? "bg-gold/15 font-bold text-gold"
                        : "text-muted-foreground",
                    )}
                  >
                    {rank}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  {scorer.playerName}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/takimlar/${scorer.teamId}`}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {scorer.teamName}
                  </Link>
                </TableCell>
                <TableCell className="text-center font-bold tabular-nums text-brand">
                  <span className="inline-flex items-center gap-1">
                    <Goal className="size-3.5" aria-hidden="true" />
                    {scorer.goals}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
