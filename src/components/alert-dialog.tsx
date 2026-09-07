"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-alert-dialog"
import { buttonVariants } from "./button.js"
export const AlertDialog = P.Root
export const AlertDialogTrigger = P.Trigger
export function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <P.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-background p-6 shadow-lg",
          className,
        )}
        {...props}
      />
    </P.Portal>
  )
}
export function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof P.Title>) {
  return <P.Title className={cn("font-body text-lead font-normal", className)} {...props} />
}
export function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof P.Description>) {
  return <P.Description className={cn("text-body text-muted-foreground", className)} {...props} />
}
export function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof P.Action>) {
  return <P.Action className={cn(buttonVariants(), className)} {...props} />
}
export function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof P.Cancel>) {
  return <P.Cancel className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />
}
export function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-wrap justify-end gap-2", className)} {...props} />
}
