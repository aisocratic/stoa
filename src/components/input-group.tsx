"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring [&>input]:min-w-0 [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-0 [&>input]:shadow-none [&>input]:ring-0",
        className,
      )}
      {...props}
    />
  )
}
export function InputGroupAddon({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("shrink-0 text-body text-muted-foreground", className)} {...props} />
}
import { Input } from "./input.js"
export function InputGroupInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input className={cn("border-0 bg-transparent px-0 shadow-none focus-visible:ring-0", className)} {...props} />
}
