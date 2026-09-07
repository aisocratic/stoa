"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-3 rounded-xl border border-border bg-card p-4", className)} {...props} />
}
export function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-w-0 flex-1 space-y-1", className)} {...props} />
}
export function ItemTitle({ className, children, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-body text-body font-medium", className)} {...props}>
      {children}
    </h3>
  )
}
export function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-body text-muted-foreground", className)} {...props} />
}
export function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex shrink-0 items-center gap-2", className)} {...props} />
}
