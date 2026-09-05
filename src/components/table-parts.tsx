"use client"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useCallback, useState, type ComponentProps, type ReactNode } from "react"

import { cn } from "../cn.js"
import { cardSurface } from "./card.js"

/**
 * The one spelling of admin table chrome. Four tables in aisocratic.org used
 * to hand-write their own `<thead>` and `<th>` classes and no two agreed,
 * so header rows on the same page rendered at different weights. Import
 * these; a bespoke table should still look like the shared ones.
 */

/** The header row inside `<thead>`. */
export const tableHeadRow = "border-b border-border bg-muted/50"
/** A header cell. Add `text-right` for numeric columns. */
export const tableHeadCell = "px-4 py-3 text-left font-body text-micro text-muted-foreground"
/** A body row. */
export const tableBodyRow = "border-b border-border last:border-0 transition-colors hover:bg-muted/30"
/** A body cell. */
export const tableBodyCell = "px-4 py-3"

/** The card that frames a table and scrolls it horizontally. */
export function TableShell({ className, scrollClassName, children, ...props }: ComponentProps<"div"> & { scrollClassName?: string }) {
  return (
    <div className={cn(cardSurface, "overflow-hidden", className)} {...props}>
      <div role="region" aria-label="Scrollable table" tabIndex={0} className={cn("overflow-x-auto", scrollClassName)}>
        {children}
      </div>
    </div>
  )
}

/** The mono result-count line: "12 venues matching “milan”". */
export function ResultsSummary({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("font-body text-micro text-muted-foreground", className)} {...props} />
}

/* ------------------------------------------------------------------ sort */

export type SortDirection = "asc" | "desc"

/** Column + direction state for a sortable table, with the toggle rule built in. */
export function useTableSort<T extends string>(defaultColumn: T, defaultDirection: SortDirection = "asc") {
  const [sortColumn, setSortColumn] = useState<T>(defaultColumn)
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultDirection)

  const handleSort = useCallback(
    (column: T) => {
      if (sortColumn === column) setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      else {
        setSortColumn(column)
        setSortDirection("asc")
      }
    },
    [sortColumn],
  )

  /** Apply the direction: returns `comparison` or `-comparison`. */
  const applySortDirection = useCallback((comparison: number) => (sortDirection === "asc" ? comparison : -comparison), [sortDirection])

  return { sortColumn, sortDirection, handleSort, applySortDirection }
}

export function SortIcon<T extends string>({
  column,
  sortColumn,
  sortDirection,
}: {
  column: T
  sortColumn: T
  sortDirection: SortDirection
}) {
  if (sortColumn !== column) return <ArrowUpDown className="ml-1 size-3 opacity-50" />
  return sortDirection === "asc" ? <ArrowUp className="ml-1 size-3" /> : <ArrowDown className="ml-1 size-3" />
}

/** The label + sort arrow, without the `<th>` — for cells someone else owns. */
export function SortableHeaderContent<T extends string>({
  label,
  column,
  sortColumn,
  sortDirection,
  className,
}: {
  label: ReactNode
  column: T
  sortColumn: T
  sortDirection: SortDirection
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {label}
      <SortIcon column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
    </span>
  )
}

export function SortableHeaderCell<T extends string>({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
  className,
  contentClassName,
}: {
  label: ReactNode
  column: T
  sortColumn: T
  sortDirection: SortDirection
  onSort: (column: T) => void
  className?: string
  contentClassName?: string
}) {
  const active = sortColumn === column
  return (
    <th className={cn(tableHeadCell, className)} aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className="inline-flex items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onSort(column)}
      >
        <SortableHeaderContent
          label={label}
          column={column}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          className={contentClassName}
        />
      </button>
    </th>
  )
}
