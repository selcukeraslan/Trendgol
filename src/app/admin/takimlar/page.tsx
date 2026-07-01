"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Users } from "lucide-react";

import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { TeamForm } from "@/components/admin/team-form";
import { TeamLogo } from "@/components/teams/team-logo";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import type { Team } from "@/types";

export default function AdminTeamsPage() {
  const loadTeams = useTeamStore((s) => s.load);
  const loadPlayers = usePlayerStore((s) => s.load);
  const teams = useTeamStore((s) => s.items);
  const loaded = useTeamStore((s) => s.loaded);
  const removeTeam = useTeamStore((s) => s.remove);
  const players = usePlayerStore((s) => s.items);

  React.useEffect(() => {
    void loadTeams();
    void loadPlayers();
  }, [loadTeams, loadPlayers]);

  const playerCount = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const player of players) {
      counts.set(player.teamId, (counts.get(player.teamId) ?? 0) + 1);
    }
    return counts;
  }, [players]);

  async function handleDelete(team: Team) {
    await removeTeam(team.id);
    toast.success(`${team.name} silindi.`);
  }

  const columns: DataTableColumn<Team>[] = [
    {
      header: "Takım",
      cell: (team) => (
        <div className="flex items-center gap-2.5">
          <TeamLogo team={team} size="sm" />
          <span className="font-medium">{team.name}</span>
        </div>
      ),
    },
    { header: "Kaptan", cell: (team) => team.captain },
    {
      header: "Oyuncu",
      className: "text-center",
      cell: (team) => playerCount.get(team.id) ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Takımlar
          </h1>
          <p className="text-sm text-muted-foreground">
            Takımları ekleyin, düzenleyin ve kadrolarını yönetin.
          </p>
        </div>
        <TeamForm
          trigger={
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Yeni Takım
            </Button>
          }
        />
      </div>

      {!loaded ? (
        <LoadingSkeleton variant="row" count={6} />
      ) : (
        <DataTable
          columns={columns}
          rows={teams}
          rowKey={(team) => team.id}
          getSearchText={(team) => `${team.name} ${team.captain}`}
          searchPlaceholder="Takım ara..."
          emptyTitle="Henüz takım yok"
          emptyDescription="İlk takımı eklemek için 'Yeni Takım' butonunu kullanın."
          actions={(team) => (
            <div className="flex items-center justify-end gap-1">
              <Link href={`/admin/takimlar/${team.id}`}>
                <Button variant="ghost" size="sm" aria-label="Oyuncular">
                  <Users className="size-4" aria-hidden="true" />
                </Button>
              </Link>
              <TeamForm
                team={team}
                trigger={
                  <Button variant="ghost" size="sm" aria-label="Düzenle">
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
              <DeleteConfirmDialog
                title={`${team.name} silinsin mi?`}
                description="Takım ve ilişkili veriler kaldırılır. Bu işlem geri alınamaz."
                onConfirm={() => handleDelete(team)}
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
