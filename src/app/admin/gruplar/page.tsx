"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { LeagueGroup } from "@/types";
import { useGroupStore } from "@/store/groupStore";
import { useTeamStore } from "@/store/teamStore";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { GroupForm } from "@/components/admin/group-form";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function AdminGroupsPage() {
  const loadGroups = useGroupStore((state) => state.load);
  const groups = useGroupStore((state) => state.items);
  const groupsLoaded = useGroupStore((state) => state.loaded);
  const removeGroup = useGroupStore((state) => state.remove);
  const loadTeams = useTeamStore((state) => state.load);
  const teams = useTeamStore((state) => state.items);
  const teamsLoaded = useTeamStore((state) => state.loaded);

  React.useEffect(() => {
    void loadGroups();
    void loadTeams();
  }, [loadGroups, loadTeams]);

  const teamCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const team of teams) {
      if (team.group) {
        counts.set(team.group, (counts.get(team.group) ?? 0) + 1);
      }
    }
    return counts;
  }, [teams]);

  async function handleDelete(group: LeagueGroup) {
    await removeGroup(group.name);
    await loadTeams();
    toast.success(`${group.name} silindi; bağlı takımlar grupsuz bırakıldı.`);
  }

  const columns: DataTableColumn<LeagueGroup>[] = [
    {
      header: "Grup Adı",
      cell: (group) => <span className="font-medium">{group.name}</span>,
    },
    {
      header: "Takım",
      className: "text-center",
      cell: (group) => teamCounts.get(group.name) ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Gruplar
          </h1>
          <p className="text-sm text-muted-foreground">
            Lig veya turnuva gruplarını oluşturun ve takımlara atayın.
          </p>
        </div>
        <GroupForm
          trigger={
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Yeni Grup
            </Button>
          }
        />
      </div>

      {!groupsLoaded || !teamsLoaded ? (
        <LoadingSkeleton variant="row" count={5} />
      ) : (
        <DataTable
          columns={columns}
          rows={groups}
          rowKey={(group) => group.name}
          getSearchText={(group) => group.name}
          searchPlaceholder="Grup ara..."
          emptyTitle="Henüz grup yok"
          emptyDescription="Takımları gruplandırmak için ilk grubu oluşturun."
          actions={(group) => (
            <div className="flex items-center justify-end gap-1">
              <GroupForm
                group={group}
                onSaved={loadTeams}
                trigger={
                  <Button variant="ghost" size="sm" aria-label="Düzenle">
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
              <DeleteConfirmDialog
                title={`${group.name} silinsin mi?`}
                description="Bu gruptaki takımlar silinmez; yalnızca grup atamaları kaldırılır."
                onConfirm={() => handleDelete(group)}
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
