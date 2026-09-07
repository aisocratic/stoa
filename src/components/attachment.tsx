"use client"

import * as React from "react"
import { cn } from "../cn.js"
import { File, X } from "lucide-react"
import { Button } from "./button.js"
export function Attachment({
  name,
  description,
  href,
  onRemove,
  state = "done",
  className,
}: {
  name: string
  description?: string
  href?: string
  onRemove?: () => void
  state?: "uploading" | "done" | "error"
  className?: string
}) {
  return (
    <div
      className={cn("flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-body", className)}
      aria-busy={state === "uploading"}
    >
      <File className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        {href ? (
          <a href={href} className="break-all underline underline-offset-4">
            {name}
          </a>
        ) : (
          <p className="break-all">{name}</p>
        )}
        <p className={cn("text-micro text-muted-foreground", state === "error" && "text-destructive")}>
          {state === "uploading" ? "Uploading…" : state === "error" ? "Upload failed" : description}
        </p>
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon" aria-label={`Remove ${name}`} onClick={onRemove}>
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
