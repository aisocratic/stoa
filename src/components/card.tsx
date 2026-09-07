import type { ComponentProps } from "react"

import { cn } from "../cn.js"

/**
 * The one card surface: background + border + radius.
 *
 * Exported as a raw class string for the cases that can't render a `<div>` —
 * a `<section>`, a `<Link>`, a `<button>`, or a component like `Collapsible`
 * that owns its own element. Everything else should use `<Card>`.
 *
 * The radius is deliberately fixed. Before this existed the same shell was
 * spelled out inline ~90 times, split between `rounded-lg` and `rounded-xl`
 * with no rule for which — so adjacent panels on the same admin page could
 * disagree about how round a card is.
 */
export const cardSurface = "bg-card border border-border rounded-xl"

/**
 * A plain card surface. Pass padding/spacing through `className` — this owns
 * only the background, border and radius so it can wrap anything.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card" className={cn(cardSurface, className)} {...props} />
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("space-y-2 p-5", className)} {...props} />
}
export function CardTitle({ className, children, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-body text-lead font-normal", className)} {...props}>
      {children}
    </h3>
  )
}
export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-body text-muted-foreground", className)} {...props} />
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5", className)} {...props} />
}
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2 px-5 pb-5", className)} {...props} />
}
