"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { Match, MatchStatus, Team } from "@/types";
import { matchStatusLabels } from "@/lib/labels";
import { useMatchStore, type MatchInput } from "@/store/matchStore";
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

const matchSchema = z
  .object({
    week: z.string().min(1, "Hafta gerekli."),
    homeTeamId: z.string().min(1, "Ev sahibi seçin."),
    awayTeamId: z.string().min(1, "Deplasman seçin."),
    date: z.string().min(1, "Tarih gerekli."),
    time: z.string().min(1, "Saat gerekli."),
    venue: z.string().min(1, "Saha gerekli."),
    status: z.enum(["scheduled", "played", "postponed"]),
    homeScore: z.string().optional(),
    awayScore: z.string().optional(),
  })
  .refine((d) => d.homeTeamId !== d.awayTeamId, {
    message: "Ev sahibi ve deplasman farklı olmalı.",
    path: ["awayTeamId"],
  })
  .refine(
    (d) => d.status !== "played" || (!!d.homeScore && !!d.awayScore),
    { message: "Oynanan maç için skor girin.", path: ["homeScore"] },
  );

type MatchFormValues = z.infer<typeof matchSchema>;

function toDefaults(match?: Match): MatchFormValues {
  return {
    week: match ? String(match.week) : "1",
    homeTeamId: match?.homeTeamId ?? "",
    awayTeamId: match?.awayTeamId ?? "",
    date: match?.date ? match.date.slice(0, 10) : "",
    time: match?.time ?? "20:00",
    venue: match?.venue ?? "",
    status: match?.status ?? "scheduled",
    homeScore: match?.homeScore != null ? String(match.homeScore) : "",
    awayScore: match?.awayScore != null ? String(match.awayScore) : "",
  };
}

interface MatchFormProps {
  trigger: React.ReactElement;
  teams: Team[];
  match?: Match;
}

export function MatchForm({ trigger, teams, match }: MatchFormProps) {
  const [open, setOpen] = React.useState(false);
  const add = useMatchStore((s) => s.add);
  const edit = useMatchStore((s) => s.edit);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: toDefaults(match),
  });

  const status = useWatch({ control: form.control, name: "status" });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset(toDefaults(match));
  }

  async function onSubmit(values: MatchFormValues) {
    const input: MatchInput = {
      week: Number(values.week),
      homeTeamId: values.homeTeamId,
      awayTeamId: values.awayTeamId,
      date: new Date(values.date).toISOString(),
      time: values.time,
      venue: values.venue,
      status: values.status as MatchStatus,
      homeScore: values.status === "played" ? Number(values.homeScore) : null,
      awayScore: values.status === "played" ? Number(values.awayScore) : null,
    };
    if (match) {
      await edit(match.id, input);
      toast.success("Maç güncellendi.");
    } else {
      await add(input);
      toast.success("Maç eklendi.");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{match ? "Maçı Düzenle" : "Yeni Maç"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="homeTeamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ev Sahibi</FormLabel>
                    <FormControl>
                      <select className={selectClass} {...field}>
                        <option value="">Seçin</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
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
                name="awayTeamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deplasman</FormLabel>
                    <FormControl>
                      <select className={selectClass} {...field}>
                        <option value="">Seçin</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hafta</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarih</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saat</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saha</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn. 1 Nolu Saha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <FormControl>
                    <select className={selectClass} {...field}>
                      {(Object.keys(matchStatusLabels) as MatchStatus[]).map(
                        (st) => (
                          <option key={st} value={st}>
                            {matchStatusLabels[st]}
                          </option>
                        ),
                      )}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status === "played" ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="homeScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ev Sahibi Skor</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="awayScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deplasman Skor</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    Vazgeç
                  </Button>
                }
              />
              <Button type="submit">{match ? "Kaydet" : "Ekle"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
