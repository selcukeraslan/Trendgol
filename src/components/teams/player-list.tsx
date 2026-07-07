import { Goal } from "lucide-react";

import type { Player } from "@/types";
import { playerPositionLabels } from "@/lib/labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";

interface PlayerListProps {
  players: Player[];
  /** Oyuncu id → maçlardan türetilen toplam gol. */
  goalsByPlayer?: Map<string, number>;
}

/** Bir takımın oyuncu kadrosunu listeler. Goller maçlardan türetilir. */
export function PlayerList({ players, goalsByPlayer }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <EmptyState
        title="Kadro henüz eklenmedi"
        description="Bu takımın oyuncuları yakında eklenecek."
      />
    );
  }

  const sorted = [...players].sort(
    (a, b) => (a.number ?? 999) - (b.number ?? 999),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-12 text-center">No</TableHead>
            <TableHead>Oyuncu</TableHead>
            <TableHead>Mevki</TableHead>
            <TableHead className="text-center">Gol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((player) => {
            const goals = goalsByPlayer?.get(player.id) ?? 0;
            return (
              <TableRow key={player.id} className="hover:bg-muted/30">
                <TableCell className="text-center font-medium tabular-nums text-muted-foreground">
                  {player.number ?? "-"}
                </TableCell>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {player.position
                    ? playerPositionLabels[player.position]
                    : "-"}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    {goals ? (
                      <Goal
                        className="size-3.5 text-brand"
                        aria-hidden="true"
                      />
                    ) : null}
                    {goals}
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
