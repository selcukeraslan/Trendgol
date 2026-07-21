"use client";

import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { SettingsFormValues } from "@/schemas/settings";
import {
  EMPTY_INFO_CARD,
  INFO_CARD_ICON_OPTIONS,
  INFO_CARD_SOURCE_OPTIONS,
} from "@/lib/info-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CardFieldName = "aboutStoryCards" | "participationCards";

interface InfoCardEditorProps {
  form: UseFormReturn<SettingsFormValues>;
  name: CardFieldName;
  title: string;
  description: string;
  showHint?: boolean;
  showHighlight?: boolean;
}

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const optionClassName = "bg-popover text-popover-foreground";

export function InfoCardEditor({
  form,
  name,
  title,
  description,
  showHint = false,
  showHighlight = false,
}: InfoCardEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });
  const cards = useWatch({ control: form.control, name });

  return (
    <div className="space-y-4 rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...EMPTY_INFO_CARD })}
        >
          <Plus className="size-4" />
          Kart Ekle
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Bu bölümde kart gösterilmeyecek. İsterseniz yeni kart ekleyebilirsiniz.
        </p>
      ) : null}

      {fields.map((fieldItem, index) => {
        const valueSource = cards?.[index]?.valueSource ?? "custom";

        return (
          <div
            key={fieldItem.id}
            className="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Kart {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
                aria-label={`${index + 1}. kartı sil`}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`${name}.${index}.label` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kart İsmi</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn. Ödül Havuzu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${name}.${index}.icon` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İkon</FormLabel>
                    <FormControl>
                      <select
                        className={selectClassName}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {INFO_CARD_ICON_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className={optionClassName}
                          >
                            {option.label}
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
                name={`${name}.${index}.valueSource` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Değer Kaynağı</FormLabel>
                    <FormControl>
                      <select
                        className={selectClassName}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {INFO_CARD_SOURCE_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className={optionClassName}
                          >
                            {option.label}
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
                name={`${name}.${index}.value` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kart Değeri</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Örn. 2026"
                        disabled={valueSource !== "custom"}
                        {...field}
                      />
                    </FormControl>
                    {valueSource !== "custom" ? (
                      <p className="text-xs text-muted-foreground">
                        Değer seçilen kaynaktan otomatik alınır.
                      </p>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showHint ? (
              <FormField
                control={form.control}
                name={`${name}.${index}.hint` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kısa Açıklama</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Örn. Sezon sonu şampiyona"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {showHighlight ? (
              <FormField
                control={form.control}
                name={`${name}.${index}.highlighted` as const}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-4">
                    <div>
                      <FormLabel>Kartı vurgula</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Kartı altın renkli çerçeveyle öne çıkarır.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
