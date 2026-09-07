"use client"

import { useId, type ReactNode } from "react"
import { cn } from "../cn.js"
import { Card } from "./card.js"
import { Badge } from "./badge.js"
import { NativeSelect } from "./native-select.js"

/** Agora's card presentation; apps own dispatch, persistence and drag-and-drop. */
export function TaskCard({
  title,
  description,
  status,
  columns,
  onStatusChange,
  onOpen,
  priority,
  assignee,
  labels = [],
  metadata,
  actions,
  compact = false,
  selected = false,
  className,
}: {
  title: string
  description?: string
  status?: string
  columns?: { value: string; label: string }[]
  onStatusChange?: (status: string) => void
  onOpen?: () => void
  priority?: "Low" | "Medium" | "High"
  assignee?: string
  labels?: string[]
  metadata?: ReactNode
  actions?: ReactNode
  compact?: boolean
  selected?: boolean
  className?: string
}) {
  const id = useId()
  return (
    <Card data-selected={selected || undefined} className={cn("p-4", selected && "ring-2 ring-primary", className)}>
      <article aria-labelledby={id} className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 id={id} className="min-w-0 font-body text-body font-medium">
            {onOpen ? (
              <button
                type="button"
                className="rounded-md text-left hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                onClick={onOpen}
              >
                {title}
              </button>
            ) : (
              title
            )}
          </h3>
          {priority && <Badge tone={priority === "High" ? "warning" : "neutral"}>{priority}</Badge>}
        </div>
        {!compact && description && <p className="text-body text-muted-foreground">{description}</p>}
        <div className="flex flex-wrap items-center gap-2">
          {status && !(columns && onStatusChange) && <Badge>{columns?.find((column) => column.value === status)?.label ?? status}</Badge>}
          {labels.map((label) => (
            <Badge key={label} tone="neutral">
              {label}
            </Badge>
          ))}
          {assignee && <span className="ms-auto text-micro text-muted-foreground">{assignee}</span>}
        </div>
        {!compact && metadata && <div className="flex flex-wrap gap-3 font-code text-micro text-muted-foreground">{metadata}</div>}
        {((columns && onStatusChange) || actions) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
            {columns && onStatusChange && (
              <NativeSelect
                className="h-8 w-auto text-micro"
                aria-label={`Move ${title}`}
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                {columns.map((column) => (
                  <option key={column.value} value={column.value}>
                    {column.label}
                  </option>
                ))}
              </NativeSelect>
            )}
            {actions}
          </div>
        )}
      </article>
    </Card>
  )
}
