"use client"

import { useMemo, useState, type ReactNode } from "react"

import { cn } from "../cn.js"
import { Button } from "./button.js"
import { Input } from "./input.js"
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js"

export type MultiSelectFilterOption = {
  value: string
  label: string
  /** Shown right-aligned when present, e.g. how many rows match. */
  count?: number
  /** Indent level, for options that form a hierarchy (0 = top). */
  depth?: number
}

export type MultiSelectFilterProps = {
  options: MultiSelectFilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  /** Trigger content, e.g. "All cities" or "3 cities" — the caller owns the count text. */
  triggerLabel: ReactNode
  /** Rendered before the trigger label. */
  icon?: ReactNode
  /** Show a "Clear all" action at the top of the list while anything is selected. */
  clearable?: boolean
  align?: "start" | "center" | "end"
  disabled?: boolean
  className?: string
  contentClassName?: string
  /** Actions below the options, such as restoring column defaults. */
  footer?: ReactNode
  /**
   * Show a search box above the list; typing narrows options by label
   * substring. Selected options always stay visible so they can be unticked.
   */
  searchable?: boolean
  searchPlaceholder?: string
}

const row = "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-body hover:bg-secondary"

/**
 * The toolbar multi-select for filter bars (cities, tags, column
 * visibility): an `h-8` outline trigger over a popover of checkboxes. The
 * caller owns the trigger text. For a labelled form field use
 * `SelectField multiple` instead.
 */
export function MultiSelectFilter({
  options,
  selectedValues,
  onChange,
  triggerLabel,
  icon,
  clearable = false,
  align = "start",
  disabled,
  className,
  contentClassName,
  footer,
  searchable = false,
  searchPlaceholder = "Search…",
}: MultiSelectFilterProps) {
  const [query, setQuery] = useState("")
  const visibleOptions = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!searchable || !needle) return options
    return options.filter((option) => selectedValues.includes(option.value) || option.label.toLowerCase().includes(needle))
  }, [options, query, searchable, selectedValues])

  const toggle = (value: string) =>
    onChange(selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value])

  return (
    <Popover onOpenChange={(open) => !open && setQuery("")}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className={cn("h-8 gap-1.5", className)}>
          {icon}
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("max-h-(--radix-popover-content-available-height) w-auto min-w-40 overflow-y-auto p-2", contentClassName)}
      >
        {searchable ? (
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            autoFocus
            className="mb-1 h-8 bg-background"
          />
        ) : null}
        {clearable && selectedValues.length > 0 ? (
          <button type="button" onClick={() => onChange([])} className={cn(row, "mb-1 text-micro text-muted-foreground")}>
            Clear all
          </button>
        ) : null}
        {visibleOptions.length === 0 ? <p className="px-2 py-1.5 text-micro text-muted-foreground">No matches.</p> : null}
        {visibleOptions.map((option) => (
          <label
            key={option.value}
            className={cn(row, "cursor-pointer")}
            style={option.depth ? { paddingLeft: `${0.5 + option.depth * 1.25}rem` } : undefined}
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="size-4 shrink-0 rounded-sm border-border accent-primary"
            />
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.count !== undefined ? (
              <span className="shrink-0 font-code text-micro tabular-nums text-muted-foreground">{option.count.toLocaleString()}</span>
            ) : null}
          </label>
        ))}
        {footer ? <div className="mt-2 border-t border-border pt-2">{footer}</div> : null}
      </PopoverContent>
    </Popover>
  )
}
