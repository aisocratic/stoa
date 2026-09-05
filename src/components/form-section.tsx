import { Check } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "../cn.js"
import { controlBase } from "../control-variants.js"
import { cardSurface } from "./card.js"

/**
 * A titled card grouping a run of form fields — the panel every admin edit
 * page is built from. The heading is the in-page `<h2>` recipe (display face,
 * mono subtitle), so a form panel's title sits at the same rhythm as the
 * section header above it.
 */
export function FormSection({
  title,
  subtitle,
  columns = 2,
  actions,
  children,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  columns?: 1 | 2
  /** Right of the heading — a small toggle, a link. */
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn(cardSurface, "p-6", className)}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-title text-foreground">{title}</h2>
          {subtitle ? <p className="mt-1 font-body text-body text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <div className={cn("grid grid-cols-1 gap-6", columns === 2 && "md:grid-cols-2")}>{children}</div>
    </section>
  )
}

/** Footer row for a form page: secondary actions left, primary right. */
export function FormActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-wrap items-center justify-end gap-2", className)} {...props} />
}

/**
 * A card-shaped toggle: interest pickers, plan choosers, radio-like grids.
 * Single vs multi-select is the caller's concern — this is one controlled
 * button with `aria-pressed`.
 */
export function ChoiceCard({
  selected,
  onClick,
  disabled,
  indicator = "none",
  icon,
  title,
  description,
  children,
  className,
  ...props
}: {
  selected: boolean
  onClick?: () => void
  disabled?: boolean
  indicator?: "none" | "radio" | "checkbox"
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  /** Free-form body, replaces title/description. */
  children?: ReactNode
  className?: string
  "aria-label"?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      data-slot="choice-card"
      className={cn(
        controlBase,
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left",
        selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30",
        className,
      )}
      {...props}
    >
      {indicator !== "none" ? (
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center border-2 transition-colors",
            indicator === "radio" ? "rounded-full" : "rounded-[4px]",
            selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
          )}
        >
          {selected ? <Check className="size-3" /> : null}
        </span>
      ) : null}
      {icon ? <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span> : null}
      {children ? (
        <span className="min-w-0 flex-1">{children}</span>
      ) : (
        <span className="min-w-0 flex-1">
          {title ? <span className="block text-body font-medium text-foreground">{title}</span> : null}
          {description ? <span className="mt-1 block text-micro text-muted-foreground">{description}</span> : null}
        </span>
      )}
    </button>
  )
}
