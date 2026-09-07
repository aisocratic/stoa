"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function Heading({ className, children, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2 className={cn("font-body text-title font-normal", className)} {...props}>
      {children}
    </h2>
  )
}
export function Text({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-body text-body text-foreground", className)} {...props} />
}
export function Code({ className, ...props }: React.ComponentProps<"code">) {
  return <code className={cn("rounded-md bg-muted px-1 py-0.5 font-code text-micro", className)} {...props} />
}
export function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return <blockquote className={cn("border-s-2 border-primary ps-4 font-body text-lead text-muted-foreground", className)} {...props} />
}
