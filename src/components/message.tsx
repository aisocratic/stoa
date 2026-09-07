"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function Message({ align = "start", className, ...props }: React.ComponentProps<"article"> & { align?: "start" | "end" }) {
  return <article className={cn("flex gap-3", align === "end" && "flex-row-reverse", className)} {...props} />
}
export function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("shrink-0", className)} {...props} />
}
export function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("min-w-0 max-w-[85%] space-y-2", className)} {...props} />
}
export function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-body text-micro text-muted-foreground", className)} {...props} />
}
export function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex gap-2 text-micro text-muted-foreground", className)} {...props} />
}
