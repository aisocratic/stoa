import type { ReactNode } from "react"

import { cn } from "../cn.js"
import { StickyBar } from "./sticky-bar.js"

/**
 * The one bar at the top of a section page: section nav, then filters left
 * and actions right. A section page no longer prints its own name — the
 * sidebar item or the section nav already says "Events" — so what used to
 * be the header row is just the page's actions, in beside the filters.
 * Filters left / actions right is the same rule the public listings use.
 */
export function PageToolbar({
  nav,
  filters,
  meta,
  actions,
  className,
}: {
  /** Sibling-section nav — a `SegmentedControl` of hrefs. */
  nav?: ReactNode
  /** Search + filter controls, all on the `h-8` rung. */
  filters?: ReactNode
  /** Result count or status line, pushed right of the filters. */
  meta?: ReactNode
  /** Page-level actions: New X, Refresh, Export. */
  actions?: ReactNode
  className?: string
}) {
  const hasRow = Boolean(filters || meta || actions)
  return (
    <StickyBar className={className}>
      {nav ? <div className={cn(hasRow && "mb-3")}>{nav}</div> : null}
      {hasRow ? (
        <div className="flex flex-wrap items-center gap-3">
          {filters ? <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{filters}</div> : <div className="flex-1" />}
          {meta}
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
    </StickyBar>
  )
}
