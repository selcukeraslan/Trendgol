import Link from "next/link";

import type { PlayerCardStat } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CardsTableProps {
  cards: PlayerCardStat[];
}

/** Kart istatistikleri tablosu — veriler maç kart kayıtlarından türetilir. */
export function CardsTable({ cards }: CardsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Oyuncu</TableHead>
            <TableHead>Takım</TableHead>
            <TableHead className="text-center">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3.5 w-2.5 rounded-[2px] bg-[#f3c94d]" />
                Sarı
              </span>
            </TableHead>
            <TableHead className="text-center">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3.5 w-2.5 rounded-[2px] bg-destructive" />
                Kırmızı
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((row, index) => (
            <TableRow key={row.playerId} className="hover:bg-muted/30">
              <TableCell className="text-center font-medium tabular-nums text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">{row.playerName}</TableCell>
              <TableCell>
                <Link
                  href={`/takimlar/${row.teamId}`}
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  {row.teamName}
                </Link>
              </TableCell>
              <TableCell className="text-center font-medium tabular-nums">
                {row.yellow || "—"}
              </TableCell>
              <TableCell className="text-center font-medium tabular-nums">
                {row.red || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
