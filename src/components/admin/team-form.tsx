"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { Team } from "@/types";
import { useTeamStore } from "@/store/teamStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const teamSchema = z.object({
  name: z.string().min(2, "Takım adı en az 2 karakter olmalı."),
  captain: z.string().min(2, "Kaptan adı gerekli."),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Geçerli bir renk seçin."),
  description: z.string().min(5, "Kısa bir açıklama girin."),
  logoUrl: z.string().optional(),
  photoUrl: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

function toDefaults(team?: Team): TeamFormValues {
  return {
    name: team?.name ?? "",
    captain: team?.captain ?? "",
    color: team?.color ?? "#22c55e",
    description: team?.description ?? "",
    logoUrl: team?.logoUrl ?? "",
    photoUrl: team?.photoUrl ?? "",
  };
}

interface TeamFormProps {
  trigger: React.ReactElement;
  team?: Team;
}

export function TeamForm({ trigger, team }: TeamFormProps) {
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
    if (team) {
      await edit(team.id, values);
      toast.success("Takım güncellendi.");
    } else {
      await add(values);
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
                  <FormLabel>Logo URL (opsiyonel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
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
