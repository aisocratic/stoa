"use client"

import * as React from "react"
import { cn } from "../cn.js"
import { Button } from "./button.js"
export function Carousel({ items, label = "Slides", className }: { items: React.ReactNode[]; label?: string; className?: string }) {
  const [index, setIndex] = React.useState(0)
  const current = Math.min(index, Math.max(0, items.length - 1))
  const id = React.useId()
  return (
    <section aria-roledescription="carousel" aria-label={label} className={cn("space-y-3", className)}>
      {items.length ? (
        <div id={id} role="group" aria-roledescription="slide" aria-label={`${current + 1} of ${items.length}`}>
          {items[current]}
        </div>
      ) : (
        <p>No slides.</p>
      )}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" aria-controls={id} disabled={current === 0} onClick={() => setIndex(current - 1)}>
          Previous
        </Button>
        <span className="font-code text-micro" aria-live="polite">
          {items.length ? current + 1 : 0} / {items.length}
        </span>
        <Button variant="outline" aria-controls={id} disabled={current >= items.length - 1} onClick={() => setIndex(current + 1)}>
          Next
        </Button>
      </div>
    </section>
  )
}
