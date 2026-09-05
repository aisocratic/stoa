import type { ComponentType, ElementType, ReactNode } from "react"

import { cn } from "../cn.js"
import { controlBase } from "../control-variants.js"

/** The trailing cell of icon actions on a table row. */
export function RowActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-1", className)}>{children}</div>
}

const base = cn(controlBase, "inline-flex cursor-pointer items-center gap-1 p-1.5 text-muted-foreground")
const variants = {
  default: "hover:bg-secondary hover:text-foreground",
  destructive: "hover:bg-destructive/10 hover:text-destructive",
}

/**
 * One row action: an icon, optionally a mono label, as a link or a button.
 * Wrap clicks in `stopPropagation` at the cell when the row itself navigates —
 * `DataTable` does this for you.
 */
export function RowAction({
  icon: Icon,
  label,
  href,
  external,
  onClick,
  variant = "default",
  title,
  linkComponent,
}: {
  icon: ComponentType<{ className?: string }>
  label?: string
  href?: string
  external?: boolean
  onClick?: () => void
  variant?: keyof typeof variants
  title?: string
  linkComponent?: ElementType
}) {
  const L = linkComponent ?? "a"
  const cls = cn(base, variants[variant])
  const accessibleLabel = label ?? title
  const content = (
    <>
      <Icon className="size-3.5" />
      {label ? <span className="font-code text-micro">{label}</span> : null}
    </>
  )
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} title={title} aria-label={accessibleLabel}>
        {content}
      </a>
    )
  }
  if (href) {
    return (
      <L href={href} className={cls} title={title} aria-label={accessibleLabel}>
        {content}
      </L>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls} title={title} aria-label={accessibleLabel}>
      {content}
    </button>
  )
}
