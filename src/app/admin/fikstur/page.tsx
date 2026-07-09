"use client";

import * as React from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { Match } from "@/types";
import { formatShortDate } from "@/lib/date";
import { useMatchStore } from "@/store/matchStore";
import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { MatchForm } from "@/components/admin/match-form";
import { StatusBadge } from "@/components/fixtures/status-badge";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function AdminFixturePage() {
  const loadMatches = useMatchStore((s) => s.load);
  const loadTeams = useTeamStore((s) => s.load);
  const loadPlayers = usePlayerStore((s) => s.load);
  const matches = useMatchStore((s) => s.items);
  const loaded = useMatchStore((s) => s.loaded);
  const removeMatch = useMatchStore((s) => s.remove);
  const teams = useTeamStore((s) => s.items);
  const players = usePlayerStore((s) => s.items);

  React.useEffect(() => {
    void loadMatches();
    void loadTeams();
    void loadPlayers();
  }, [loadMatches, loadTeams, loadPlayers]);

  const teamMap = React.useMemo(
    () => new Map(teams.map((t) => [t.id, t])),
    [teams],
  );

  const sorted = React.useMemo(
    () =>
      [...matches].sort(
        (a, b) => a.week - b.week || a.time.localeCompare(b.time),
      ),
    [matches],
  );

  function teamName(id: string) {
    return teamMap.get(id)?.name ?? "?";
  }

  async function handleDelete(match: Match) {
    await removeMatch(match.id);
    toast.success("Maç silindi.");
  }

  const columns: DataTableColumn<Match>[] = [
    { header: "Hafta", className: "text-center w-16", cell: (m) => m.week },
    {
      header: "Maç",
      cell: (m) => (
        <span className="font-medium">
          {teamName(m.homeTeamId)}{" "}
          <span className="text-muted-foreground">vs</span>{" "}
          {teamName(m.awayTeamId)}
        </span>
      ),
    },
    {
      header: "Skor",
      className: "text-center",
      cell: (m) =>
        m.status === "played" ? (
          <span className="font-heading font-bold tabular-nums">
            {m.homeScore} - {m.awayScore}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      header: "Tarih",
      cell: (m) =>
        [formatShortDate(m.date), m.time].filter(Boolean).join(" · ") || "—",
    },
    { header: "Durum", cell: (m) => <StatusBadge status={m.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Fikstür Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground">
            Maç ekleyin, skor girin ve durum güncelleyin.
          </p>
        </div>
        <MatchForm
          teams={teams}
          players={players}
          trigger={
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Yeni Maç
            </Button>
          }
        />
      </div>

      {!loaded ? (
        <LoadingSkeleton variant="row" count={8} />
      ) : (
        <DataTable
          columns={columns}
          rows={sorted}
          rowKey={(m) => m.id}
          getSearchText={(m) =>
            `${teamName(m.homeTeamId)} ${teamName(m.awayTeamId)} ${m.venue}`
          }
          searchPlaceholder="Maç ara..."
          emptyTitle="Henüz maç yok"
          emptyDescription="İlk maçı eklemek için 'Yeni Maç' butonunu kullanın."
          actions={(match) => (
            <div className="flex items-center justify-end gap-1">
              <MatchForm
                teams={teams}
                players={players}
                match={match}
                trigger={
                  <Button variant="ghost" size="sm" aria-label="Düzenle">
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
              <DeleteConfirmDialog
                title="Maç silinsin mi?"
                onConfirm={() => handleDelete(match)}
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
