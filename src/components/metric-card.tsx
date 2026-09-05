import type { CSSProperties, ReactNode } from "react"

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

/**
 * The admin's stat card: an eyebrow label with an optional icon, and a
 * display-face value. `compact` is the tinted in-card variant; `progress`
 * renders the label/value row over a bar instead of a card.
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
  progress?: MetricCardProgress
}) {
  if (progress) {
    const { percentage, barWidthPercent, barColor = "bg-primary", barStyle, showPercentage = true, ariaLabel, ariaValueText } = progress
    const width = barWidthPercent ?? percentage
    const valueNow = Math.round(Math.min(100, Math.max(0, width)))
    return (
      <div className={cn("group", className)}>
        <div className="mb-0.5 flex items-center justify-between">
          <span className="truncate font-code text-micro">{label}</span>
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
      </div>
    )
  }

  const compact = size === "compact"
  return (
    <div title={title} className={cn(compact ? "rounded-md bg-secondary/50 p-2" : cn(cardSurface, "p-4"), className)}>
      <div className={cn("flex items-center gap-2 text-muted-foreground", !compact && "mb-1", labelClassName)}>
        {icon}
        <span className="text-eyebrow font-code">{label}</span>
        {trailing ? <span className="ml-auto">{trailing}</span> : null}
      </div>
      <p className={cn("font-display text-foreground", compact ? "text-lead" : "text-title", valueClassName)}>{value}</p>
    </div>
  )
}
