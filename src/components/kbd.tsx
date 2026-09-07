"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 font-code text-micro text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}
