"use client"

import { Fragment, useDeferredValue, useEffect, useMemo, useState, type ElementType, type ReactNode } from "react"

import { cn } from "../cn.js"
import { Button } from "./button.js"
import { Checkbox } from "./checkbox.js"
import { EmptyState } from "./empty-state.js"
import { SearchField } from "./field.js"
import { MetricCard } from "./metric-card.js"
import { PageToolbar } from "./page-toolbar.js"
import { PaginationControls } from "./pagination.js"
import { SelectField } from "./select-field.js"
import {
  ResultsSummary,
  SortableHeaderContent,
  TableShell,
  tableBodyCell,
  tableBodyRow,
  tableHeadCell,
  tableHeadRow,
  useTableSort,
} from "./table-parts.js"

/** A column. Add `sortKey` + `sortValue` to make its header sortable. */
export interface DataColumn<T> {
  header: ReactNode
  cell: (row: T) => ReactNode
  /** Defaults to "left". */
  align?: "left" | "right"
  /** Hide below this breakpoint. */
  hideBelow?: "md" | "lg"
  className?: string
  headerClassName?: string
  sortKey?: string
  sortValue?: (row: T) => string | number
}

/**
 * A select filter. In-memory tables apply `predicate`; server tables report
 * the change through `server.onFilterChange` and show `value`.
 */
export interface DataFilter<T> {
  key: string
  allLabel: string
  options: { value: string; label: string }[]
  predicate?: (row: T, value: string) => boolean
  /** Current value in server mode; "" or "all" means no filter. */
  value?: string
}

export interface DataStat {
  icon?: ReactNode
  label: ReactNode
  value: ReactNode
}

/**
 * Server mode: the page holds one page of rows, and search, filters and
 * pagination are reported back (URL params or a fetch) instead of applied
 * here. Give `getPageHref` for link pagination, `onPageChange` for buttons.
 */
export interface DataTableServer {
  total: number
  page: number
  pageSize: number
  query?: string
  sortKey?: string
  sortDirection?: "asc" | "desc"
  onSearch?: (query: string) => void
  onFilterChange?: (key: string, value: string) => void
  onSortChange?: (key: string, direction: "asc" | "desc") => void
  onPageChange?: (page: number) => void
  getPageHref?: (page: number) => string
  loading?: boolean
}

export interface DataTableProps<T> {
  rows: T[]
  rowKey: (row: T) => string
  columns: DataColumn<T>[]
  /** Text a row is matched against for search (case-insensitive `includes`). In-memory mode. */
  searchText?: (row: T) => string
  searchPlaceholder?: string
  filters?: DataFilter<T>[]
  /** Trailing actions cell — `RowActions`. Adds an "Actions" column. */
  rowActions?: (row: T) => ReactNode
  /** Renders the first data cell as a link. */
  rowHref?: (row: T) => string
  /** Renders the first data cell as a button when `rowHref` is absent. */
  onRowClick?: (row: T) => void
  /** Intercepts a `rowHref` link click. Pass `router.push` for client navigation. */
  onNavigate?: (href: string) => void
  renderSubRow?: (row: T) => ReactNode
  /** Paginate in memory when set. */
  pageSize?: number
  defaultSort?: { key: string; dir?: "asc" | "desc" }
  /** Rows matching this always float to the top, ahead of the sort. */
  pinFirst?: (row: T) => boolean
  /** Sibling-section nav — a `SegmentedControl`. */
  sectionNav?: ReactNode
  toolbarActions?: ReactNode
  /** Controlled multi-select: pass both to render a leading checkbox column. */
  selectedKeys?: Set<string>
  onSelectionChange?: (keys: Set<string>) => void
  /** Shown in a bar above the table while rows are selected. */
  bulkActions?: ReactNode
  stats?: DataStat[]
  /** Singular noun for the count line — "venue" → "12 venues". */
  resultNoun?: string
  resultNounPlural?: string
  emptyLabel?: string
  server?: DataTableServer
  linkComponent?: ElementType
  className?: string
}

/**
 * The admin list. One component for both archetypes aisocratic.org keeps:
 * in-memory (the page loads every row; search, filter, sort and paginate
 * here) and server-driven (`server` — the page holds one page and the table
 * reports what the reader asked for). Same columns, same chrome, same bar
 * at the top: nav, then filters left / count / actions right. Prefer server
 * mode above roughly 1,000 rows; in-memory search is deferred and indexed,
 * but the component deliberately does not bundle a virtualization engine.
 */
export function DataTable<T>({
  rows,
  rowKey,
  columns,
  searchText,
  searchPlaceholder = "Search...",
  filters = [],
  rowActions,
  rowHref,
  onRowClick,
  onNavigate,
  renderSubRow,
  pageSize,
  defaultSort,
  pinFirst,
  sectionNav,
  toolbarActions,
  selectedKeys,
  onSelectionChange,
  bulkActions,
  stats,
  resultNoun = "result",
  resultNounPlural,
  emptyLabel,
  server,
  linkComponent,
  className,
}: DataTableProps<T>) {
  const L = linkComponent ?? "a"
  const [query, setQuery] = useState(server?.query ?? "")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const deferredQuery = useDeferredValue(query)
  const localSort = useTableSort<string>(defaultSort?.key ?? "", defaultSort?.dir ?? "asc")
  const sortColumn = server ? (server.sortKey ?? "") : localSort.sortColumn
  const sortDirection = server ? (server.sortDirection ?? "asc") : localSort.sortDirection

  useEffect(() => {
    if (server) setQuery(server.query ?? "")
  }, [server, server?.query])

  const handleSort = (column: string) => {
    if (!server) {
      localSort.handleSort(column)
      return
    }
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc"
    server.onSortChange?.(column, direction)
  }

  const sortValueByKey = useMemo(() => {
    const map = new Map<string, (row: T) => string | number>()
    for (const col of columns) if (col.sortKey && col.sortValue) map.set(col.sortKey, col.sortValue)
    return map
  }, [columns])
  const searchIndex = useMemo(
    () => (searchText ? new Map(rows.map((row) => [row, searchText(row).toLocaleLowerCase()])) : undefined),
    [rows, searchText],
  )

  const processed = useMemo(() => {
    let result = rows
    if (!server) {
      const q = deferredQuery.trim().toLowerCase()
      result = rows.filter((row) => {
        if (q && searchIndex && !searchIndex.get(row)?.includes(q)) return false
        for (const f of filters) {
          const v = filterValues[f.key] ?? "all"
          if (v !== "all" && f.predicate && !f.predicate(row, v)) return false
        }
        return true
      })
    }
    const sortFn = !server && sortColumn ? sortValueByKey.get(sortColumn) : undefined
    if (sortFn || pinFirst) {
      result = [...result].sort((a, b) => {
        if (pinFirst) {
          const diff = (pinFirst(a) ? 0 : 1) - (pinFirst(b) ? 0 : 1)
          if (diff !== 0) return diff
        }
        if (!sortFn) return 0
        const av = sortFn(a)
        const bv = sortFn(b)
        return localSort.applySortDirection(
          typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv)),
        )
      })
    }
    return result
  }, [rows, server, deferredQuery, searchIndex, filters, filterValues, sortColumn, sortValueByKey, localSort.applySortDirection, pinFirst])

  const total = server ? server.total : processed.length
  const effectivePageSize = server ? server.pageSize : pageSize
  const totalPages = effectivePageSize ? Math.max(1, Math.ceil(total / effectivePageSize)) : 1
  const currentPage = server ? Math.min(Math.max(1, server.page), totalPages) : Math.min(page, totalPages)
  const visible = !server && pageSize ? processed.slice((currentPage - 1) * pageSize, currentPage * pageSize) : processed

  const selectable = Boolean(selectedKeys && onSelectionChange)
  const colSpan = columns.length + (rowActions ? 1 : 0) + (selectable ? 1 : 0)
  const noun = (n: number) => (n === 1 ? resultNoun : (resultNounPlural ?? `${resultNoun}s`))

  const visibleKeys = visible.map(rowKey)
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((k) => selectedKeys?.has(k))
  const someVisibleSelected = visibleKeys.some((k) => selectedKeys?.has(k))
  const toggleAll = () => {
    if (!selectedKeys || !onSelectionChange) return
    const next = new Set(selectedKeys)
    for (const k of visibleKeys) {
      if (allVisibleSelected) next.delete(k)
      else next.add(k)
    }
    onSelectionChange(next)
  }
  const toggleOne = (key: string) => {
    if (!selectedKeys || !onSelectionChange) return
    const next = new Set(selectedKeys)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange(next)
  }

  const hasToolbar = Boolean(searchText || server?.onSearch || filters.length > 0 || toolbarActions)
  const count = (
    <ResultsSummary>
      {total.toLocaleString()} {noun(total)}
      {server?.query ? <> matching &ldquo;{server.query}&rdquo;</> : null}
    </ResultsSummary>
  )

  return (
    <div className={cn("space-y-6", className)}>
      {sectionNav || hasToolbar ? (
        <PageToolbar
          nav={sectionNav}
          filters={
            hasToolbar ? (
              <>
                {searchText || server?.onSearch ? (
                  <form
                    className="min-w-[200px] flex-1"
                    onSubmit={(e) => {
                      e.preventDefault()
                      server?.onSearch?.(query)
                    }}
                  >
                    <SearchField
                      value={query}
                      onValueChange={(v) => {
                        setQuery(v)
                        setPage(1)
                      }}
                      clearable={!server}
                      placeholder={searchPlaceholder}
                      aria-label={searchPlaceholder}
                    />
                  </form>
                ) : null}
                {filters.map((f) => (
                  <SelectField
                    key={f.key}
                    aria-label={f.allLabel}
                    value={server ? f.value || "all" : (filterValues[f.key] ?? "all")}
                    onValueChange={(v) => {
                      if (server) server.onFilterChange?.(f.key, v === "all" ? "" : v)
                      else {
                        setFilterValues((prev) => ({ ...prev, [f.key]: v }))
                        setPage(1)
                      }
                    }}
                    options={[{ value: "all", label: f.allLabel }, ...f.options]}
                  />
                ))}
              </>
            ) : null
          }
          meta={count}
          actions={toolbarActions}
        />
      ) : (
        count
      )}

      {stats?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <MetricCard key={i} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>
      ) : null}

      {selectable && selectedKeys!.size > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
          <span className="font-body text-micro text-muted-foreground">{selectedKeys!.size} selected</span>
          {bulkActions}
          <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground" onClick={() => onSelectionChange!(new Set())}>
            Clear
          </Button>
        </div>
      ) : null}

      <TableShell aria-busy={server?.loading || undefined}>
        <table className="w-full text-body">
          <thead>
            <tr className={tableHeadRow}>
              {selectable ? (
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="Select all rows on this page"
                  />
                </th>
              ) : null}
              {columns.map((col, i) => {
                const sortable = Boolean(col.sortKey && col.sortValue)
                const active = sortable && sortColumn === col.sortKey
                return (
                  <th
                    key={i}
                    aria-sort={sortable ? (active ? (sortDirection === "asc" ? "ascending" : "descending") : "none") : undefined}
                    className={cn(
                      tableHeadCell,
                      col.align === "right" && "text-right",
                      col.hideBelow === "md" && "hidden md:table-cell",
                      col.hideBelow === "lg" && "hidden lg:table-cell",
                      col.headerClassName,
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          col.align === "right" && "ml-auto",
                        )}
                        onClick={() => handleSort(col.sortKey!)}
                      >
                        <SortableHeaderContent
                          label={col.header}
                          column={col.sortKey!}
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                        />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
              {rowActions ? <th className={tableHeadCell}>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const key = rowKey(row)
              const sub = renderSubRow?.(row)
              const href = rowHref?.(row)
              return (
                <Fragment key={key}>
                  <tr className={tableBodyRow}>
                    {selectable ? (
                      <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedKeys!.has(key)} onCheckedChange={() => toggleOne(key)} aria-label="Select row" />
                      </td>
                    ) : null}
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={cn(
                          tableBodyCell,
                          col.align === "right" && "text-right",
                          col.hideBelow === "md" && "hidden md:table-cell",
                          col.hideBelow === "lg" && "hidden lg:table-cell",
                          col.className,
                        )}
                      >
                        {href && i === 0 ? (
                          <L
                            href={href}
                            onClick={(event: { preventDefault: () => void; stopPropagation: () => void }) => {
                              event.stopPropagation()
                              if (onNavigate) {
                                event.preventDefault()
                                onNavigate(href)
                              }
                            }}
                            className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {col.cell(row)}
                          </L>
                        ) : onRowClick && i === 0 ? (
                          <button
                            type="button"
                            onClick={() => onRowClick(row)}
                            className="rounded-sm text-left underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {col.cell(row)}
                          </button>
                        ) : (
                          col.cell(row)
                        )}
                      </td>
                    ))}
                    {rowActions ? (
                      <td className={tableBodyCell} onClick={(e) => e.stopPropagation()}>
                        {rowActions(row)}
                      </td>
                    ) : null}
                  </tr>
                  {sub ? (
                    <tr className="border-b border-border bg-muted/20">
                      <td colSpan={colSpan} className="p-0">
                        {sub}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <EmptyState bodyClassName="font-body text-micro">
                    {emptyLabel ?? `No ${resultNounPlural ?? `${resultNoun}s`} found`}
                  </EmptyState>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </TableShell>

      {totalPages > 1 ? (
        server?.getPageHref ? (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            getHref={server.getPageHref}
            linkComponent={linkComponent}
          />
        ) : (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            disabled={server?.loading}
            onPageChange={(p) => (server ? server.onPageChange?.(p) : setPage(Math.min(totalPages, Math.max(1, p))))}
          />
        )
      ) : null}
    </div>
  )
}
