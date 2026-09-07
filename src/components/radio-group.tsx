"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-radio-group"
export function RadioGroup({ className, ...props }: React.ComponentProps<typeof P.Root>) {
  return <P.Root className={cn("grid gap-3", className)} {...props} />
}
export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof P.Item>) {
  return (
    <P.Item
      className={cn(
        "size-4 shrink-0 rounded-full border border-input text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <P.Indicator className="flex items-center justify-center after:size-2 after:rounded-full after:bg-current" />
    </P.Item>
  )
}
