import type React from "react"

import { cn } from "../cn.js"

/**
 * "There's nothing here" — one component instead of ~20.
 *
 * A sweep of the public pages found the same block written out again and
 * again: `text-center py-12` with a mono paragraph (`/blog`, `/news`,
 * `tag-filtered-list` — which *also* imports an EmptyState), an icon+title+body
 * variant (`/search`, chapter discussions), and a dashed-bordered panel
 * (`/blog`, `/jobs`, `mixed-feed-section`'s module-private `EmptyPanel`,
 * `/news/lists`). Those are three shapes, so this takes a `variant` rather
 * than pretending they were one.
 *
 * The admin dashboard uses this component too, through the `AdminEmptyState`
 * preset in `app/(admin)/admin/_shared/empty-state.tsx`, which swaps the
 * public type-scale body for the admin's mono style via `bodyClassName`.
 * (This file is on the type-scale hard-zero list, so the admin tokens
 * themselves cannot live here.)
 */
export function EmptyState({
  icon,
  title,
  children,
  action,
  variant = "plain",
  bodyClassName,
  className,
}: {
  icon?: React.ReactNode
  /** Optional headline above the body copy. */
  title?: React.ReactNode
  children?: React.ReactNode
  /** A CTA under the copy — "Browse the blog", "Clear filters". */
  action?: React.ReactNode
  variant?: "plain" | "panel"
  /** Replaces the body's `text-body` type step (admin surfaces pass mono). */
  bodyClassName?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "text-center",
        variant === "panel"
          ? "rounded-xl border border-dashed border-border p-8"
          : "py-12",
        className,
      )}
    >
      {icon ? (
        <div className="mb-3 flex justify-center text-muted-foreground">{icon}</div>
      ) : null}
      {title ? <p className="font-display text-lead text-foreground">{title}</p> : null}
      {children ? (
        <p className={cn(bodyClassName ?? "text-body", "text-muted-foreground", title && "mt-2")}>
          {children}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
