"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Arama kutusu için satır metni çıkarıcı. Verilmezse arama gösterilmez. */
  getSearchText?: (row: T) => string;
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  rowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Admin listeleri için yeniden kullanılabilir tablo (arama + aksiyonlar). */
export function DataTable<T>({
  columns,
  rows,
  getSearchText,
  searchPlaceholder = "Ara...",
  actions,
  rowKey,
  emptyTitle = "Kayıt bulunamadı",
  emptyDescription,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");

  const filtered =
    getSearchText && query.trim()
      ? rows.filter((row) =>
          getSearchText(row)
            .toLocaleLowerCase("tr")
            .includes(query.toLocaleLowerCase("tr")),
        )
      : rows;

  return (
    <div className="space-y-4">
      {getSearchText ? (
        <div className="relative max-w-xs">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                {columns.map((column) => (
                  <TableHead key={column.header} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
                {actions ? (
                  <TableHead className="w-0 text-right">İşlemler</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={rowKey(row)} className="hover:bg-muted/30">
                  {columns.map((column) => (
                    <TableCell
                      key={column.header}
                      className={cn(column.className)}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                  {actions ? (
                    <TableCell className="text-right whitespace-nowrap">
                      {actions(row)}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
