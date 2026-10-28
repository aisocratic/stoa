"use client"

/**
 * The cmdk search list inside a searchable or multiple `SelectField`'s
 * popover. Its own module so cmdk loads when such a select is first opened,
 * not with every page that renders any SelectField: a plain filter select
 * on an admin table was shipping cmdk (~11 KB gz) it never used.
 * `select-field` imports this lazily; import `SelectField`, not this.
 */
import { Check } from "lucide-react"

import { cn } from "../cn.js"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command.js"

export type SearchableOption = { value: string; label: string }

export function SearchableOptionList({
  groups,
  multiple = false,
  isSelected,
  onSelect,
}: {
  /** Options by group name ("" for ungrouped), in display order. */
  groups: [string, SearchableOption[]][]
  /** Multi-select rows show a checkbox; single-select rows a check mark. */
  multiple?: boolean
  isSelected: (value: string) => boolean
  onSelect: (value: string) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(([name, opts]) => (
          <CommandGroup key={name} heading={name || undefined}>
            {opts.map((o) => (
              <CommandItem key={o.value} value={o.label} onSelect={() => onSelect(o.value)}>
                {multiple ? (
                  <span
                    className={cn(
                      "mr-2 flex size-4 items-center justify-center rounded-[4px] border border-primary",
                      isSelected(o.value) ? "bg-primary text-primary-foreground" : "opacity-50",
                    )}
                  >
                    {isSelected(o.value) ? <Check className="size-3" /> : null}
                  </span>
                ) : (
                  <Check className={cn("mr-2 size-4", isSelected(o.value) ? "opacity-100" : "opacity-0")} />
                )}
                {o.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  )
}
