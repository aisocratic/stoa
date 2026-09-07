"use client"

import * as React from "react"
import { cn } from "../cn.js"
import { Drawer as P } from "vaul"
export const Drawer = P.Root
export const DrawerTrigger = P.Trigger
export const DrawerClose = P.Close
export function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <P.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-auto rounded-t-xl border border-border bg-background p-6 text-foreground",
          className,
        )}
        {...props}
      >
        <div aria-hidden="true" className="mx-auto mb-6 h-1 w-12 rounded-full bg-muted" />
        {children}
      </P.Content>
    </P.Portal>
  )
}
export function DrawerTitle({ className, ...props }: React.ComponentProps<typeof P.Title>) {
  return <P.Title className={cn("font-body text-lead", className)} {...props} />
}
export function DrawerDescription({ className, ...props }: React.ComponentProps<typeof P.Description>) {
  return <P.Description className={cn("mt-2 text-body text-muted-foreground", className)} {...props} />
}
