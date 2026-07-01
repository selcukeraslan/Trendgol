"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";

import type { Player } from "@/types";
import { playerPositionLabels } from "@/lib/labels";
import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PlayerForm } from "@/components/admin/player-form";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function AdminPlayersPage() {
  const params = useParams<{ id: string }>();
  const teamId = params.id;

  const loadTeams = useTeamStore((s) => s.load);
  const loadPlayers = usePlayerStore((s) => s.load);
  const teams = useTeamStore((s) => s.items);
  const players = usePlayerStore((s) => s.items);
  const loaded = usePlayerStore((s) => s.loaded);
  const removePlayer = usePlayerStore((s) => s.remove);

  React.useEffect(() => {
    void loadTeams();
    void loadPlayers();
  }, [loadTeams, loadPlayers]);

  const team = teams.find((t) => t.id === teamId);
  const teamPlayers = players
    .filter((p) => p.teamId === teamId)
    .sort((a, b) => (a.number ?? 999) - (b.number ?? 999));

  async function handleDelete(player: Player) {
    await removePlayer(player.id);
    toast.success(`${player.name} silindi.`);
  }

  const columns: DataTableColumn<Player>[] = [
    {
      header: "No",
      className: "text-center w-12",
      cell: (p) => p.number ?? "-",
    },
    { header: "Oyuncu", cell: (p) => <span className="font-medium">{p.name}</span> },
    {
      header: "Mevki",
      cell: (p) => (p.position ? playerPositionLabels[p.position] : "-"),
    },
    { header: "Gol", className: "text-center", cell: (p) => p.goals ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/admin/takimlar"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Takımlar
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            {team ? `${team.name} — Kadro` : "Kadro"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Takımın oyuncularını ekleyin ve düzenleyin.
          </p>
        </div>
        <PlayerForm
          teamId={teamId}
          trigger={
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Yeni Oyuncu
            </Button>
          }
        />
      </div>

      {!loaded ? (
        <LoadingSkeleton variant="row" count={5} />
      ) : (
        <DataTable
          columns={columns}
          rows={teamPlayers}
          rowKey={(p) => p.id}
          getSearchText={(p) => p.name}
          searchPlaceholder="Oyuncu ara..."
          emptyTitle="Kadro boş"
          emptyDescription="İlk oyuncuyu eklemek için 'Yeni Oyuncu' butonunu kullanın."
          actions={(player) => (
            <div className="flex items-center justify-end gap-1">
              <PlayerForm
                teamId={teamId}
                player={player}
                trigger={
                  <Button variant="ghost" size="sm" aria-label="Düzenle">
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
              <DeleteConfirmDialog
                title={`${player.name} silinsin mi?`}
                onConfirm={() => handleDelete(player)}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    aria-label="Sil"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
            </div>
          )}
        />
      )}
    </div>
  );
}
