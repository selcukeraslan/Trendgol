"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { Player, PlayerPosition } from "@/types";
import { playerPositionLabels } from "@/lib/labels";
import { usePlayerStore, type PlayerInput } from "@/store/playerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const playerSchema = z.object({
  name: z.string().min(2, "Oyuncu adı gerekli."),
  number: z.string().optional(),
  position: z.string().optional(),
  goals: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

function toDefaults(player?: Player): PlayerFormValues {
  return {
    name: player?.name ?? "",
    number: player?.number != null ? String(player.number) : "",
    position: player?.position ?? "",
    goals: player?.goals != null ? String(player.goals) : "",
  };
}

interface PlayerFormProps {
  trigger: React.ReactElement;
  teamId: string;
  player?: Player;
}

export function PlayerForm({ trigger, teamId, player }: PlayerFormProps) {
  const [open, setOpen] = React.useState(false);
  const add = usePlayerStore((s) => s.add);
  const edit = usePlayerStore((s) => s.edit);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: toDefaults(player),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset(toDefaults(player));
  }

  async function onSubmit(values: PlayerFormValues) {
    const input: PlayerInput = {
      teamId,
      name: values.name,
      number: values.number ? Number(values.number) : undefined,
      position: values.position
        ? (values.position as PlayerPosition)
        : undefined,
      goals: values.goals ? Number(values.goals) : 0,
    };
    if (player) {
      await edit(player.id, input);
      toast.success("Oyuncu güncellendi.");
    } else {
      await add(input);
      toast.success("Oyuncu eklendi.");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {player ? "Oyuncuyu Düzenle" : "Yeni Oyuncu"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="Oyuncu adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={99}
                        placeholder="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gol</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mevki</FormLabel>
                  <FormControl>
                    <select className={selectClass} {...field}>
                      <option value="">Belirtilmemiş</option>
                      {(
                        Object.keys(playerPositionLabels) as PlayerPosition[]
                      ).map((pos) => (
                        <option key={pos} value={pos}>
                          {playerPositionLabels[pos]}
                        </option>
                      ))}
                    </select>
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
              <Button type="submit">{player ? "Kaydet" : "Ekle"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
