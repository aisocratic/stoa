"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-toggle"
export function Toggle({ className, ...props }: React.ComponentProps<typeof P.Root>) {
  return (
    <P.Root
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 border border-border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  )
}
