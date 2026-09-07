"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-context-menu"
export const ContextMenu = P.Root
export function ContextMenuTrigger({ className, ...props }: React.ComponentProps<typeof P.Trigger>) {
  return (
    <P.Trigger
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
export function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        className={cn(
          "z-50 rounded-xl border border-border bg-popover p-4 font-body text-body text-foreground shadow-md min-w-44 p-1",
          className,
        )}
        {...props}
      />
    </P.Portal>
  )
}
export function ContextMenuItem({ className, ...props }: React.ComponentProps<typeof P.Item>) {
  return (
    <P.Item
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 cursor-default data-[highlighted]:bg-accent data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
export function ContextMenuLabel({ className, ...props }: React.ComponentProps<typeof P.Label>) {
  return <P.Label className={cn("px-3 py-2 font-code text-micro text-muted-foreground", className)} {...props} />
}
export function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof P.Separator>) {
  return <P.Separator className={cn("my-1 h-px bg-border", className)} {...props} />
}
export const ContextMenuGroup = P.Group
export const ContextMenuSub = P.Sub
export function ContextMenuSubTrigger({ className, ...props }: React.ComponentProps<typeof P.SubTrigger>) {
  return (
    <P.SubTrigger
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=open]:bg-accent data-[highlighted]:bg-accent",
        className,
      )}
      {...props}
    />
  )
}
export function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof P.SubContent>) {
  return (
    <P.SubContent
      className={cn(
        "z-50 rounded-xl border border-border bg-popover p-4 font-body text-body text-foreground shadow-md min-w-44 p-1",
        className,
      )}
      {...props}
    />
  )
}
export function ContextMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof P.CheckboxItem>) {
  return (
    <P.CheckboxItem
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 flex gap-2 data-[highlighted]:bg-accent",
        className,
      )}
      {...props}
    >
      <span className="w-4">
        <P.ItemIndicator>✓</P.ItemIndicator>
      </span>
      {children}
    </P.CheckboxItem>
  )
}
export const ContextMenuRadioGroup = P.RadioGroup
export function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof P.RadioItem>) {
  return (
    <P.RadioItem
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 flex gap-2 data-[highlighted]:bg-accent",
        className,
      )}
      {...props}
    >
      <span className="w-4">
        <P.ItemIndicator>●</P.ItemIndicator>
      </span>
      {children}
    </P.RadioItem>
  )
}
