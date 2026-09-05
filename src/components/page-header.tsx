import type { ReactNode } from "react"

import { cn } from "../cn.js"

/**
 * The admin's record header: a display-face title, a muted mono subtitle,
 * actions on the right. Before this became canonical the admin carried
 * seven different title specs; reach for it rather than hand-rolling an
 * `<h1>`. Section pages that are already named by the sidebar render no
 * visible heading at all — this is for the page that nothing else names: a
 * user, an event, a document.
 *
 * Vertical rhythm belongs to the parent (`space-y-6`); the header has no
 * bottom margin of its own.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  children,
  className,
  as: Tag = "h1",
}: {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  /** Under the subtitle — a meta row, badges. */
  children?: ReactNode
  className?: string
  as?: "h1" | "h2"
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <Tag className="font-display text-page text-foreground">{title}</Tag>
        {subtitle ? <p className="mt-1 font-body text-body text-muted-foreground">{subtitle}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
