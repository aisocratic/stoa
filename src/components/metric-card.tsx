import type { CSSProperties, ElementType, ReactNode } from "react"

import { cn } from "../cn.js"
import { cardSurface } from "./card.js"

type MetricCardProgress = {
  /** Fill percentage (0–100), also the readout next to the value. */
  percentage: number
  /** Bar width override; falls back to `percentage`. */
  barWidthPercent?: number
  /** Tailwind background class for the fill. Defaults to `bg-primary`. */
  barColor?: string
  /** For a fill that comes from a CSS variable (a chart slot) — applied on top of `barColor`. */
  barStyle?: CSSProperties
  showPercentage?: boolean
  /** When set, the track is a `role="progressbar"` with `aria-valuenow`, so the bar is not colour-only. */
  ariaLabel?: string
  ariaValueText?: string
}

/** The shared affordance for a metric that navigates somewhere. */
const linkChrome = "block transition-colors hover:bg-muted/30 outline-none focus-visible:ring-2 focus-visible:ring-ring"

/**
 * The admin's stat card: an eyebrow label with an optional icon, and a
 * display-face value. `compact` is the tinted in-card variant; `progress`
 * renders the label/value row over a bar instead of a card. With `href` the
 * whole card (or bar row) is a link to the rows behind the number.
 */
export function MetricCard({
  icon,
  label,
  value,
  size = "default",
  trailing,
  className,
  labelClassName,
  valueClassName,
  title,
  href,
  hrefLabel,
  external,
  linkComponent,
  progress,
}: {
  icon?: ReactNode
  label: ReactNode
  value: ReactNode
  size?: "default" | "compact"
  trailing?: ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
  /** Native `title` — the exact figure when `value` is abbreviated ("1.2B"). */
  title?: string
  /**
   * Drill-down target: the page that lists the rows behind the number. The
   * card becomes a link with the admin row affordance (`hover:bg-muted/30` and
   * a focus ring); without it the card stays a plain `<div>`.
   */
  href?: string
  /** Accessible name for the link when the label alone is ambiguous ("Founders: view these people"). Ignored without `href`. */
  hrefLabel?: string
  /** The target is outside the app: a plain `<a>` that opens in a new tab. Ignored without `href`. */
  external?: boolean
  /** The link element for in-app `href`s — pass Next.js `Link` for client routing. Defaults to `<a>`. */
  linkComponent?: ElementType
  progress?: MetricCardProgress
}) {
  /** Both variants go through this, so a tile and a bar row can never differ in hover and focus treatment. */
  const frame = (body: ReactNode, frameClassName: string) => {
    if (!href) {
      return (
        <div title={title} className={frameClassName}>
          {body}
        </div>
      )
    }
    const cls = cn(linkChrome, frameClassName)
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" title={title} aria-label={hrefLabel} className={cls}>
          {body}
        </a>
      )
    }
    const L = linkComponent ?? "a"
    return (
      <L href={href} title={title} aria-label={hrefLabel} className={cls}>
        {body}
      </L>
    )
  }

  if (progress) {
    const { percentage, barWidthPercent, barColor = "bg-primary", barStyle, showPercentage = true, ariaLabel, ariaValueText } = progress
    const width = barWidthPercent ?? percentage
    const valueNow = Math.round(Math.min(100, Math.max(0, width)))
    return frame(
      <>
        <div className="mb-0.5 flex items-center justify-between">
          <span className={cn("truncate font-code text-micro", href && "group-hover:underline")}>{label}</span>
          <div className="ml-2 flex shrink-0 items-center gap-2">
            {showPercentage ? <span className="font-code text-micro text-muted-foreground">{percentage.toFixed(0)}%</span> : null}
            <span className="w-12 text-right font-code text-micro font-medium">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
          </div>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-secondary/60"
          role={ariaLabel ? "progressbar" : undefined}
          aria-label={ariaLabel}
          aria-valuemin={ariaLabel ? 0 : undefined}
          aria-valuemax={ariaLabel ? 100 : undefined}
          aria-valuenow={ariaLabel ? valueNow : undefined}
          aria-valuetext={ariaLabel ? ariaValueText : undefined}
        >
          <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${Math.min(100, width)}%`, ...barStyle }} />
        </div>
      </>,
      cn("group rounded-md", className),
    )
  }

  const compact = size === "compact"
  return frame(
    <>
      <div className={cn("flex items-center gap-2 text-muted-foreground", !compact && "mb-1", labelClassName)}>
        {icon}
        <span className="text-eyebrow font-code">{label}</span>
        {trailing ? <span className="ml-auto">{trailing}</span> : null}
      </div>
      <p className={cn("font-body font-normal text-foreground", compact ? "text-lead" : "text-title", valueClassName)}>{value}</p>
    </>,
    cn(compact ? "rounded-md bg-secondary/50 p-2" : cn(cardSurface, "p-4"), className),
  )
}
