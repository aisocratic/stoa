"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function Bubble({ variant = "default", className, ...props }: React.ComponentProps<"div"> & { variant?: "default" | "primary" }) {
  return (
    <div
      className={cn(
        "w-fit max-w-full rounded-xl px-4 py-3 font-body text-body",
        variant === "primary" ? "bg-primary text-primary-foreground" : "border border-border bg-card",
        className,
      )}
      {...props}
    />
  )
}
export function BubbleContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("whitespace-pre-wrap break-words", className)} {...props} />
}
export function BubbleReactions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-2 flex flex-wrap gap-1", className)} {...props} />
}
