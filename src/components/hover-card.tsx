"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-hover-card"
export const HoverCard = P.Root
export const HoverCardTrigger = P.Trigger
export function HoverCardContent({ className, sideOffset = 6, ...props }: React.ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        sideOffset={sideOffset}
        className={cn("z-50 rounded-xl border border-border bg-popover p-4 font-body text-body text-foreground shadow-md w-72", className)}
        {...props}
      />
    </P.Portal>
  )
}
