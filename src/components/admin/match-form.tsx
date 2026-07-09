"use client";

import * as React from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import type { Match, MatchStatus, Player, Team } from "@/types";
import { matchSchema, type MatchFormValues } from "@/schemas/match";
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
  "flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// Native option'lar metin/zemin rengini güvenilir almaz; açıkça basıyoruz ki
// koyu temada da okunur olsun.
const optionClass = "bg-popover text-popover-foreground";

function toDefaults(match?: Match): MatchFormValues {
  return {
    week: match ? String(match.week) : "1",
    homeTeamId: match?.homeTeamId ?? "",
    awayTeamId: match?.awayTeamId ?? "",
    date: match?.date ? match.date.slice(0, 10) : "",
    time: match?.time ?? "",
    venue: match?.venue ?? "",
    status: match?.status ?? "scheduled",
    homeScore: match?.homeScore != null ? String(match.homeScore) : "",
    awayScore: match?.awayScore != null ? String(match.awayScore) : "",
    scorers:
      match?.scorers?.map((s) => ({
        playerId: s.playerId,
        goals: String(s.goals),
      })) ?? [],
    cards:
      match?.cards?.map((c) => ({ playerId: c.playerId, type: c.type })) ?? [],
  };
}

interface MatchFormProps {
  trigger: React.ReactElement;
  teams: Team[];
  players: Player[];
  match?: Match;
}

export function MatchForm({ trigger, teams, players, match }: MatchFormProps) {
  const [open, setOpen] = React.useState(false);
  const add = useMatchStore((s) => s.add);
  const edit = useMatchStore((s) => s.edit);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: toDefaults(match),
  });

  const status = useWatch({ control: form.control, name: "status" });
  const homeTeamId = useWatch({ control: form.control, name: "homeTeamId" });
  const awayTeamId = useWatch({ control: form.control, name: "awayTeamId" });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scorers",
  });
  const {
    fields: cardFields,
    append: appendCard,
    remove: removeCard,
  } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  // Golcü seçiminde yalnızca maçtaki iki takımın oyuncuları gösterilir.
  const matchPlayers = React.useMemo(
    () =>
      players.filter(
        (p) => p.teamId === homeTeamId || p.teamId === awayTeamId,
      ),
    [players, homeTeamId, awayTeamId],
  );

  // Golcü listesinde oyuncu adının yanında takımını göstermek için.
  const teamNameById = React.useMemo(
    () => new Map(teams.map((team) => [team.id, team.name])),
    [teams],
  );

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset(toDefaults(match));
  }

  async function onSubmit(values: MatchFormValues) {
    const isPlayed = values.status === "played";
    const scorers = isPlayed
      ? (values.scorers ?? [])
          .filter((s) => s.playerId && Number(s.goals) > 0)
          .map((s) => ({ playerId: s.playerId, goals: Number(s.goals) }))
      : [];
    const cards = isPlayed
      ? (values.cards ?? [])
          .filter((c) => c.playerId)
          .map((c) => ({ playerId: c.playerId, type: c.type }))
      : [];

    const input: MatchInput = {
      week: Number(values.week) || 1,
      homeTeamId: values.homeTeamId,
      awayTeamId: values.awayTeamId,
      date: values.date ? new Date(values.date).toISOString() : "",
      time: values.time,
      venue: values.venue,
      status: values.status as MatchStatus,
      homeScore:
        isPlayed && values.homeScore !== "" ? Number(values.homeScore) : null,
      awayScore:
        isPlayed && values.awayScore !== "" ? Number(values.awayScore) : null,
      scorers,
      cards,
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
                        <option className={optionClass} value="">
                          Seçin
                        </option>
                        {teams.map((team) => (
                          <option
                            key={team.id}
                            className={optionClass}
                            value={team.id}
                          >
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
                        <option className={optionClass} value="">
                          Seçin
                        </option>
                        {teams.map((team) => (
                          <option
                            key={team.id}
                            className={optionClass}
                            value={team.id}
                          >
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
                          <option key={st} className={optionClass} value={st}>
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
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="homeScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ev Sahibi Skor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                          />
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
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Golcüler — gol krallığı bu kayıtlardan türetilir */}
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="mb-0">Golcüler</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!homeTeamId || !awayTeamId}
                      onClick={() => append({ playerId: "", goals: "1" })}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      Golcü Ekle
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {homeTeamId && awayTeamId
                        ? "Henüz golcü eklenmedi."
                        : "Önce ev sahibi ve deplasman takımlarını seçin."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {fields.map((row, index) => (
                        <div key={row.id} className="flex items-start gap-2">
                          <FormField
                            control={form.control}
                            name={`scorers.${index}.playerId`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <select className={selectClass} {...field}>
                                    <option className={optionClass} value="">
                                      Oyuncu seçin
                                    </option>
                                    {matchPlayers.map((player) => (
                                      <option
                                        key={player.id}
                                        className={optionClass}
                                        value={player.id}
                                      >
                                        {player.name}
                                        {teamNameById.has(player.teamId)
                                          ? ` (${teamNameById.get(player.teamId)})`
                                          : ""}
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
                            name={`scorers.${index}.goals`}
                            render={({ field }) => (
                              <FormItem className="w-20">
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    aria-label="Gol sayısı"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            aria-label="Golcüyü kaldır"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kartlar — kart istatistikleri bu kayıtlardan türetilir */}
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="mb-0">Kartlar</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!homeTeamId || !awayTeamId}
                      onClick={() =>
                        appendCard({ playerId: "", type: "yellow" })
                      }
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      Kart Ekle
                    </Button>
                  </div>

                  {cardFields.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {homeTeamId && awayTeamId
                        ? "Henüz kart eklenmedi."
                        : "Önce ev sahibi ve deplasman takımlarını seçin."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {cardFields.map((row, index) => (
                        <div key={row.id} className="flex items-start gap-2">
                          <FormField
                            control={form.control}
                            name={`cards.${index}.playerId`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <select className={selectClass} {...field}>
                                    <option className={optionClass} value="">
                                      Oyuncu seçin
                                    </option>
                                    {matchPlayers.map((player) => (
                                      <option
                                        key={player.id}
                                        className={optionClass}
                                        value={player.id}
                                      >
                                        {player.name}
                                        {teamNameById.has(player.teamId)
                                          ? ` (${teamNameById.get(player.teamId)})`
                                          : ""}
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
                            name={`cards.${index}.type`}
                            render={({ field }) => (
                              <FormItem className="w-28">
                                <FormControl>
                                  <select
                                    className={selectClass}
                                    aria-label="Kart türü"
                                    {...field}
                                  >
                                    <option
                                      className={optionClass}
                                      value="yellow"
                                    >
                                      Sarı
                                    </option>
                                    <option className={optionClass} value="red">
                                      Kırmızı
                                    </option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            aria-label="Kartı kaldır"
                            onClick={() => removeCard(index)}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
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
