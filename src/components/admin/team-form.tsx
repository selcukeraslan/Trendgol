"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { LeagueGroup, Team } from "@/types";
import { teamSchema, type TeamFormValues } from "@/schemas/team";
import { useTeamStore } from "@/store/teamStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/image-upload";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const optionClass = "bg-popover text-popover-foreground";

function toDefaults(team?: Team): TeamFormValues {
  return {
    name: team?.name ?? "",
    captain: team?.captain ?? "",
    color: team?.color ?? "#22c55e",
    description: team?.description ?? "",
    logoUrl: team?.logoUrl ?? "",
    photoUrl: team?.photoUrl ?? "",
    group: team?.group ?? "",
  };
}

interface TeamFormProps {
  trigger: React.ReactElement;
  team?: Team;
  groups: LeagueGroup[];
}

export function TeamForm({ trigger, team, groups }: TeamFormProps) {
  const [open, setOpen] = React.useState(false);
  const add = useTeamStore((s) => s.add);
  const edit = useTeamStore((s) => s.edit);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: toDefaults(team),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset(toDefaults(team));
  }

  async function onSubmit(values: TeamFormValues) {
    // Boş string repository tarafından veritabanında NULL'a çevrilir.
    const payload = { ...values, group: values.group };
    if (team) {
      await edit(team.id, payload);
      toast.success("Takım güncellendi.");
    } else {
      await add(payload);
      toast.success("Takım eklendi.");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{team ? "Takımı Düzenle" : "Yeni Takım"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Takım Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn. Şimşekler SK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="captain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kaptan</FormLabel>
                    <FormControl>
                      <Input placeholder="Kaptan adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renk</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-input bg-transparent"
                          aria-label="Takım rengi"
                        />
                        <Input {...field} placeholder="#22c55e" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grup (opsiyonel)</FormLabel>
                  <FormControl>
                    <select className={selectClass} {...field}>
                      <option className={optionClass} value="">
                        Grupsuz
                      </option>
                      {groups.map((group) => (
                        <option
                          key={group.name}
                          className={optionClass}
                          value={group.name}
                        >
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Takım hakkında kısa açıklama"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (opsiyonel)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="teams"
                      alt="Logo önizleme"
                      previewClassName="h-24 w-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Takım Fotoğrafı (opsiyonel)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="teams"
                      alt="Takım fotoğrafı önizleme"
                      previewClassName="h-32"
                      aspect={16 / 9}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    Vazgeç
                  </Button>
                }
              />
              <Button type="submit">{team ? "Kaydet" : "Ekle"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
