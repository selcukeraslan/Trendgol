"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { LeagueGroup } from "@/types";
import { groupSchema, type GroupFormValues } from "@/schemas/group";
import { useGroupStore } from "@/store/groupStore";
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

interface GroupFormProps {
  trigger: React.ReactElement;
  group?: LeagueGroup;
  onSaved?: () => Promise<void> | void;
}

export function GroupForm({ trigger, group, onSaved }: GroupFormProps) {
  const [open, setOpen] = React.useState(false);
  const add = useGroupStore((state) => state.add);
  const rename = useGroupStore((state) => state.rename);
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: group?.name ?? "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset({ name: group?.name ?? "" });
  }

  async function onSubmit(values: GroupFormValues) {
    try {
      if (group) {
        if (values.name !== group.name) {
          await rename(group.name, values.name);
          await onSaved?.();
        }
        toast.success("Grup güncellendi.");
      } else {
        await add(values.name);
        toast.success("Grup oluşturuldu.");
      }
      setOpen(false);
    } catch {
      form.setError("name", {
        message: "Bu grup adı kullanılıyor veya grup kaydedilemedi.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{group ? "Grubu Düzenle" : "Yeni Grup"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grup Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn. Trendgol Yaz Ligi" {...field} />
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {group ? "Kaydet" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
