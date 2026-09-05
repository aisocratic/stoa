import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ElementType } from "react"

import { cn } from "../cn.js"
import { buttonVariants } from "./button.js"

type Base = {
  currentPage: number
  totalPages: number
  /** Replaces the "Page 2 of 9" line. */
  label?: string
  className?: string
  linkComponent?: ElementType
}

type HrefMode = Base & { getHref: (page: number) => string; onPageChange?: never; disabled?: never }
type CallbackMode = Base & {
  onPageChange: (page: number) => void
  getHref?: never
  /** Disable both controls while a fetch is in flight. */ disabled?: boolean
}

/**
 * Prev / Next with the mono page line. Link mode (`getHref`) for URL-driven
 * lists, button mode (`onPageChange`) for in-memory ones.
 */
export function PaginationControls(props: HrefMode | CallbackMode) {
  const { currentPage, totalPages, label, className, linkComponent } = props
  const L = linkComponent ?? "a"
  const safeTotal = Math.max(1, totalPages)
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal)
  const externallyDisabled = "onPageChange" in props && props.disabled === true
  const canPrev = safeCurrent > 1 && !externallyDisabled
  const canNext = safeCurrent < safeTotal && !externallyDisabled

  const control = (target: number, enabled: boolean, direction: "prev" | "next") => {
    const ariaLabel = direction === "prev" ? "Go to previous page" : "Go to next page"
    const cls = cn(buttonVariants({ variant: "ghost", size: "default" }), "gap-1 px-2.5")
    const inner =
      direction === "prev" ? (
        <>
          <ChevronLeft />
          <span className="hidden sm:block">Previous</span>
        </>
      ) : (
        <>
          <span className="hidden sm:block">Next</span>
          <ChevronRight />
        </>
      )
    if (!enabled) {
      return (
        <span aria-disabled="true" className={cn(cls, "pointer-events-none opacity-50")}>
          {inner}
        </span>
      )
    }
    if ("getHref" in props && props.getHref) {
      return (
        <L href={props.getHref(target)} aria-label={ariaLabel} className={cls}>
          {inner}
        </L>
      )
    }
    return (
      <button type="button" aria-label={ariaLabel} className={cls} onClick={() => "onPageChange" in props && props.onPageChange?.(target)}>
        {inner}
      </button>
    )
  }

  return (
    <div className={cn("flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center", className)}>
      <div className="font-code text-micro text-muted-foreground">{label ?? `Page ${safeCurrent} of ${safeTotal}`}</div>
      <nav role="navigation" aria-label="pagination">
        <ul className="flex items-center gap-1">
          <li>{control(safeCurrent - 1, canPrev, "prev")}</li>
          <li>{control(safeCurrent + 1, canNext, "next")}</li>
        </ul>
      </nav>
    </div>
  )
}
