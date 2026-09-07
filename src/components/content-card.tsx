"use client"

import { useId, type ReactNode } from "react"
import { Card } from "./card.js"
import { cn } from "../cn.js"

/** Website event, article and chapter cards without app/router dependencies. */
export function ContentCard({
  title,
  href,
  description,
  eyebrow,
  media,
  footer,
  editorial = false,
  className,
}: {
  title: string
  href?: string
  description?: string
  eyebrow?: ReactNode
  media?: ReactNode
  footer?: ReactNode
  editorial?: boolean
  className?: string
}) {
  const id = useId()
  return (
    <Card className={cn("overflow-hidden", className)}>
      <article aria-labelledby={id}>
        {media && <div className="aspect-video overflow-hidden bg-muted [&>img]:size-full [&>img]:object-cover">{media}</div>}
        <div className="space-y-3 p-5">
          {eyebrow && <div className="font-code text-micro text-muted-foreground">{eyebrow}</div>}
          <h3 id={id} className={cn("text-lead font-normal", editorial ? "font-display text-title" : "font-body")}>
            {href ? (
              <a href={href} className="rounded-md hover:underline focus-visible:outline-2 focus-visible:outline-ring">
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          {description && <p className="text-body text-muted-foreground">{description}</p>}
          {footer && <div className="border-t border-border pt-3 text-micro">{footer}</div>}
        </div>
      </article>
    </Card>
  )
}
