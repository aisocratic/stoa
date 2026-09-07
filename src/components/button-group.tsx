"use client"

import * as React from "react"
import { cn } from "../cn.js"
export function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center [&>button]:rounded-none [&>button:first-child]:rounded-s-md [&>button:last-child]:rounded-e-md [&>button+button]:border-s-0",
        className,
      )}
      {...props}
    />
  )
}
