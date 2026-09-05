import { Slot } from "@radix-ui/react-slot"
import type { ReactNode } from "react"

import { cn } from "../cn.js"
import { controlBase, controlColor, controlSize } from "../control-variants.js"
import { cardSurface } from "./card.js"
import { stickyRailClass } from "./sticky-bar.js"

/* ------------------------------------------------------------ FilterChip */

const chipSize = { default: controlSize.default, sm: controlSize.sm } as const
const chipVariant = {
  solid: { selected: controlColor.default, unselected: controlColor.secondary },
  outline: {
    selected: "bg-primary/10 border border-primary/30 text-primary",
    unselected: "bg-card border border-border text-foreground hover:border-primary/50",
  },
} as const

/**
 * A filter pill or toggle — the /events, /news and /blog filter language.
 * `asChild` renders the caller's element (a `Link`) in place of the button;
 * the child must then carry its own icon.
 */
export function FilterChip({
  selected = false,
  onClick,
  disabled,
  icon,
  children,
  variant = "solid",
  shape = "rounded",
  size = "default",
  asChild = false,
  className,
}: {
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
  icon?: ReactNode
  children: ReactNode
  variant?: keyof typeof chipVariant
  shape?: "rounded" | "pill"
  size?: keyof typeof chipSize
  asChild?: boolean
  className?: string
}) {
  const Comp = asChild ? Slot : "button"
  const tones = chipVariant[variant]
  return (
    <Comp
      {...(asChild ? {} : { type: "button" as const, onClick, disabled, "aria-pressed": selected })}
      className={cn(
        controlBase,
        "inline-flex items-center",
        chipSize[size],
        shape === "pill" && "rounded-full",
        icon && "gap-1.5",
        selected ? tones.selected : tones.unselected,
        className,
      )}
    >
      {asChild ? (
        children
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </Comp>
  )
}

/* --------------------------------------------------------- FilterToolbar */

/**
 * The row above a public listing: filters left, actions right. Each side is
 * its own flex row so on a narrow screen they wrap onto their own lines.
 */
export function FilterToolbar({ filters, actions, className }: { filters: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">{filters}</div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/* ------------------------------------------------------------ FilterRail */

/**
 * The sticky filter column on explorer pages — more filters than a toolbar
 * row can hold. The card surface, the one sticky offset, `h-fit` so it does
 * not stretch to the grid row and defeat `sticky`. Fields go inside as
 * `SearchField` / `SelectField` / `FilterChip`.
 */
export function FilterRail({
  children,
  className,
  "aria-label": ariaLabel = "Filters",
}: {
  children: ReactNode
  className?: string
  "aria-label"?: string
}) {
  return (
    <aside aria-label={ariaLabel} className={cn(cardSurface, stickyRailClass, "h-fit space-y-4 p-4", className)}>
      {children}
    </aside>
  )
}
