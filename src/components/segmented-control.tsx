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
  /**
   * Passed to `linkComponent` as its `prefetch` prop (Next.js `<Link>`), so an
   * expensive section can opt out of speculative route work. Ignored for a
   * plain `<a>`.
   */
  prefetch?: boolean
  /**
   * A second level that belongs to this segment (the views of a section,
   * say). While the segment is selected its options sit inline right after
   * its label, inside the same tinted pill, so the choice reads as part of
   * the segment instead of as a second control somewhere else on the page.
   */
  sub?: SegmentedControlSub
}

export type SegmentedControlSub = {
  "aria-label": string
  options: Pick<SegmentedControlOption, "value" | "label" | "icon" | "title">[]
  value: string | null
  onValueChange?: (value: string) => void
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
  /* A selected segment with a second level: the tint moves to the pill that
     wraps the label and its options, and the chosen option is cut out of it
     in the card colour, the way the segment itself is cut out of the bar. */
  group: "inline-flex h-full shrink-0 items-center rounded-full bg-primary/10 pr-0.5",
  groupWrapped: "h-7",
  subBase: "inline-flex h-[18px] items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-body transition-colors",
  subWrapped: "h-6",
  subSelected: "bg-card text-primary",
  subUnselected: "text-muted-foreground hover:text-foreground",
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
  /** The link element for `href` segments — pass Next.js `Link` to get client routing and `prefetch`. */
  linkComponent?: ElementType
  "aria-label"?: string
}) {
  const L = linkComponent ?? "a"
  return (
    <div className={cn(containerClass, wrap && "h-auto min-h-8 flex-wrap gap-1", className)} aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = option.value === value
        const sub = selected ? option.sub : undefined
        const cls = cn(
          segment.base,
          wrap && segment.wrapped,
          option.icon && "gap-1.5",
          selected ? segment.selected : segment.unselected,
          sub && "bg-transparent",
          segmentClassName,
        )
        const item = option.href ? (
          <L
            key={option.value}
            href={option.href}
            {...(linkComponent && option.prefetch !== undefined ? { prefetch: option.prefetch } : {})}
            aria-current={selected ? "page" : undefined}
            title={option.title}
            className={cls}
          >
            {option.icon}
            {option.label}
          </L>
        ) : (
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
        if (!sub) return item

        return (
          <span key={option.value} className={cn(segment.group, wrap && segment.groupWrapped)}>
            {item}
            <span role="group" aria-label={sub["aria-label"]} className="inline-flex items-center gap-px">
              {sub.options.map((subOption) => (
                <button
                  key={subOption.value}
                  type="button"
                  onClick={() => sub.onValueChange?.(subOption.value)}
                  aria-pressed={subOption.value === sub.value}
                  title={subOption.title}
                  className={cn(
                    segment.subBase,
                    wrap && segment.subWrapped,
                    subOption.value === sub.value ? segment.subSelected : segment.subUnselected,
                  )}
                >
                  {subOption.icon}
                  {subOption.label}
                </button>
              ))}
            </span>
          </span>
        )
      })}
    </div>
  )
}
