"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "react-resizable-panels"
export const ResizablePanel = P.Panel
export function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof P.PanelGroup>) {
  return <P.PanelGroup className={cn("flex size-full data-[panel-group-direction=vertical]:flex-col", className)} {...props} />
}
export function ResizableHandle({ className, ...props }: React.ComponentProps<typeof P.PanelResizeHandle>) {
  return (
    <P.PanelResizeHandle
      className={cn(
        "relative w-1 bg-border outline-none focus-visible:bg-primary data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full",
        className,
      )}
      {...props}
    />
  )
}
