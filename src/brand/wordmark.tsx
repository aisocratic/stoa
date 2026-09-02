import type { ComponentProps } from "react"

import { brand } from "../tokens/brand.js"
import { RING_PATH, VIEW_BOX, WORDMARK_PATH } from "./paths.js"

let seq = 0

/**
 * The full lockup — ring plus the "AI Socratic" wordmark — as one inline SVG.
 * The wordmark is `currentColor`, so it is theme-aware for free: put it in a
 * `text-foreground` context and it is right in both modes. Height sets the
 * size; width follows the lockup's aspect.
 */
export function Wordmark({ height = 32, mono = false, title = brand.name, ...props }: ComponentProps<"svg"> & { height?: number | string; mono?: boolean; title?: string }) {
  const id = `stoa-lockup-${++seq}`
  const ratio = VIEW_BOX.width / VIEW_BOX.height
  const width = typeof height === "number" ? Math.round(height * ratio) : undefined
  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      height={height}
      width={width}
      role="img"
      aria-label={title}
      {...props}
    >
      {!mono ? (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            {brand.gradient.stops.map((s) => (
              <stop key={s.at} offset={`${s.at}%`} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      <path d={RING_PATH} fill={mono ? "currentColor" : `url(#${id})`} />
      <path d={WORDMARK_PATH} fill="currentColor" />
    </svg>
  )
}
