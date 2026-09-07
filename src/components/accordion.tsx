"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
export const Accordion = P.Root
export function AccordionItem({ className, ...props }: React.ComponentProps<typeof P.Item>) {
  return <P.Item className={cn("border-b border-border", className)} {...props} />
}
export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof P.Trigger>) {
  return (
    <P.Header>
      <P.Trigger
        className={cn(
          "group flex w-full items-center justify-between gap-4 py-4 text-left font-body text-body focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
      </P.Trigger>
    </P.Header>
  )
}
export function AccordionContent({ className, ...props }: React.ComponentProps<typeof P.Content>) {
  return <P.Content className={cn("pb-4 text-body text-muted-foreground", className)} {...props} />
}
