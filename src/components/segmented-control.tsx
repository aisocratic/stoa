import type { ElementType, ReactNode } from "react"

import { cn } from "../cn.js"

export type SegmentedControlOption<T extends string = string> = {
  value: T
  label: ReactNode
  icon?: ReactNode
  /** Native hover text for terse labels. A `title`, not a tooltip: a tooltip trigger inside a button is invalid HTML. */
  title?: string
  /** Render this segment as a link instead of a button — route nav that works in server components. */
  href?: string
}

/**
 * The view switcher from the admin: a pill container with `p-1`, the
 * selected segment tinted primary. One canonical style across the platform.
 * Use it for route navigation between sibling sections (segments with
 * `href`) and for in-page view toggles (segments with `onValueChange`);
 * Radix `Tabs` is for in-content panels only.
 */
const containerClass = "inline-flex h-8 items-center rounded-full border border-border bg-card p-1"

const segment = {
  base: "inline-flex h-full items-center rounded-full px-3 text-body transition-colors",
  wrapped: "h-7 px-2.5",
  selected: "bg-primary/10 text-primary",
  unselected: "text-muted-foreground hover:text-foreground",
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className,
  segmentClassName,
  wrap = false,
  linkComponent,
  "aria-label": ariaLabel,
}: {
  options: SegmentedControlOption<T>[]
  value: T | null
  onValueChange?: (value: T) => void
  className?: string
  segmentClassName?: string
  /** Let segments run onto a second line; releases the fixed height. */
  wrap?: boolean
  linkComponent?: ElementType
  "aria-label"?: string
}) {
  const L = linkComponent ?? "a"
  return (
    <div className={cn(containerClass, wrap && "h-auto min-h-8 flex-wrap gap-1", className)} aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = option.value === value
        const cls = cn(
          segment.base,
          wrap && segment.wrapped,
          option.icon && "gap-1.5",
          selected ? segment.selected : segment.unselected,
          segmentClassName,
        )
        if (option.href) {
          return (
            <L key={option.value} href={option.href} aria-current={selected ? "page" : undefined} title={option.title} className={cls}>
              {option.icon}
              {option.label}
            </L>
          )
        }
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange?.(option.value)}
            aria-pressed={selected}
            title={option.title}
            className={cls}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
