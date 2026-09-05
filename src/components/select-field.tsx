"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "../cn.js"
import { fieldVariants } from "../control-variants.js"
import { Badge } from "./badge.js"
import { Button } from "./button.js"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command.js"
import { FieldWrapper, useFieldIds } from "./field.js"
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select.js"

export type SelectOption = { value: string; label: string; group?: string }

type Base = {
  label?: React.ReactNode
  description?: string
  error?: string
  required?: boolean
  className?: string
  options: SelectOption[]
  placeholder?: string
  /** Popover + command palette instead of a native-style menu. */
  searchable?: boolean
  disabled?: boolean
  /** Accessible name when there is no visible label — compact filter dropdowns. */
  "aria-label"?: string
  /** `chip` makes a searchable trigger read as a filter pill beside `FilterChip`s. */
  triggerVariant?: "field" | "chip"
  /** For `chip`: fills primary when the filter is narrowing the view. */
  triggerActive?: boolean
}

type Single = Base & { multiple?: false; value?: string; onValueChange?: (value: string) => void; values?: never; onValuesChange?: never }
type Multi = Base & { multiple: true; values?: string[]; onValuesChange?: (values: string[]) => void; value?: never; onValueChange?: never }

export type SelectFieldProps = Single | Multi

/**
 * The one labelled select. Single and plain → Radix Select; `searchable` or
 * `multiple` → a popover with a command list. Options may carry a `group`.
 */
export function SelectField(props: SelectFieldProps) {
  const {
    label,
    description,
    error,
    required,
    className,
    options,
    placeholder = "Select...",
    searchable,
    disabled,
    multiple,
    "aria-label": ariaLabel,
    triggerVariant = "field",
    triggerActive = false,
  } = props
  const { id, ariaDescribedBy } = useFieldIds(error, description)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const groups = useMemo(() => {
    const map = new Map<string, SelectOption[]>()
    for (const opt of options) {
      const key = opt.group ?? ""
      const group = map.get(key)
      if (group) group.push(opt)
      else map.set(key, [opt])
    }
    return [...map.entries()]
  }, [options])
  const optionByValue = useMemo(() => new Map(options.map((option) => [option.value, option])), [options])

  const wrap = (child: React.ReactNode) => (
    <FieldWrapper id={id} label={label} description={description} error={error} required={required} className={className}>
      {child}
    </FieldWrapper>
  )

  if (!multiple && !searchable) {
    const single = props as Single
    return wrap(
      <Select value={single.value} onValueChange={single.onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(fieldVariants(), "w-full justify-between")}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {groups.map(([name, opts]) =>
            name ? (
              <SelectGroup key={name}>
                <SelectLabel>{name}</SelectLabel>
                {opts.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              opts.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))
            ),
          )}
        </SelectContent>
      </Select>,
    )
  }

  if (multiple) {
    const multi = props as Multi
    const selected = multi.values ?? []
    const selectedSet = new Set(selected)
    const toggle = (v: string) => multi.onValuesChange?.(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
    return wrap(
      <div className="space-y-2">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={ariaDescribedBy}
              aria-label={ariaLabel}
              className={cn("min-h-8 w-full justify-between font-normal", !selected.length && "text-muted-foreground")}
            >
              <span className="truncate">{selected.length ? `${selected.length} selected` : placeholder}</span>
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start" disablePortal>
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {groups.map(([name, opts]) => (
                  <CommandGroup key={name} heading={name || undefined}>
                    {opts.map((o) => (
                      <CommandItem key={o.value} value={o.label} onSelect={() => toggle(o.value)}>
                        <span
                          className={cn(
                            "mr-2 flex size-4 items-center justify-center rounded-[4px] border border-primary",
                            selectedSet.has(o.value) ? "bg-primary text-primary-foreground" : "opacity-50",
                          )}
                        >
                          {selectedSet.has(o.value) ? <Check className="size-3" /> : null}
                        </span>
                        {o.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selected.length ? (
          <div className="flex flex-wrap gap-1" aria-label="Selected options">
            {selected.map((value) => {
              const option = optionByValue.get(value)
              const optionLabel = option?.label ?? value
              return (
                <Badge key={value} variant="secondary" className="gap-1 pr-1">
                  {optionLabel}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggle(value)}
                    className="rounded-md p-0.5 hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Remove ${optionLabel}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        ) : null}
      </div>,
    )
  }

  const single = props as Single
  const current = options.find((o) => o.value === single.value)
  return wrap(
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={triggerVariant === "chip" ? (triggerActive ? "default" : "secondary") : "outline"}
          role="combobox"
          aria-expanded={popoverOpen}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          className={cn(
            "w-full justify-between",
            triggerVariant === "chip" ? "rounded-full" : cn("font-normal", !single.value && "text-muted-foreground"),
          )}
        >
          {current?.label ?? placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start" disablePortal>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map(([name, opts]) => (
              <CommandGroup key={name} heading={name || undefined}>
                {opts.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      single.onValueChange?.(o.value)
                      setPopoverOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 size-4", single.value === o.value ? "opacity-100" : "opacity-0")} />
                    {o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>,
  )
}
