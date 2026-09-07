"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-navigation-menu"
export function NavigationMenu({ className, ...props }: React.ComponentProps<typeof P.Root>) {
  return <P.Root className={cn("relative font-body text-body", className)} {...props} />
}
export function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof P.List>) {
  return <P.List className={cn("flex list-none flex-wrap gap-1", className)} {...props} />
}
export function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof P.Item>) {
  return <P.Item className={cn("relative", className)} {...props} />
}
export function NavigationMenuTrigger({ className, ...props }: React.ComponentProps<typeof P.Trigger>) {
  return (
    <P.Trigger
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[state=open]:bg-accent",
        className,
      )}
      {...props}
    />
  )
}
export function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof P.Link>) {
  return (
    <P.Link
      className={cn(
        "rounded-md px-3 py-2 font-body text-body outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 block hover:bg-accent data-[active]:bg-accent",
        className,
      )}
      {...props}
    />
  )
}
export function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof P.Content>) {
  return (
    <P.Content
      className={cn(
        "absolute start-0 top-full z-50 rounded-xl border border-border bg-popover p-4 font-body text-body text-foreground shadow-md w-64",
        className,
      )}
      {...props}
    />
  )
}
