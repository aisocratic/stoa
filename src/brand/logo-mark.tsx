import { useId, type ComponentProps } from "react"

import { brand } from "../tokens/brand.js"
import { RING_PATH } from "./paths.js"

/**
 * The mark: a ring filled with the brand gradient. Square, sized by the
 * `size` prop (or CSS). Pass `mono` to render the ring in `currentColor`
 * instead — for favicons, monochrome print, or a mark set into a coloured
 * band where the gradient would fight it.
 */
export function LogoMark({
  size = 32,
  mono = false,
  title = brand.name,
  ...props
}: ComponentProps<"svg"> & { size?: number | string; mono?: boolean; title?: string }) {
  const id = `aisocratic-design-mark-${useId().replace(/\W/g, "")}`
  return (
    <svg viewBox="0 0 796 796" width={size} height={size} role="img" aria-label={title} {...props}>
      {!mono ? (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            {brand.gradient.stops.map((s) => (
              <stop key={s.at} offset={`${s.at}%`} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      {/* The ring path is drawn in the lockup's 2822×796 space with the ring at x≈67..763; shift it to origin. */}
      <path d={RING_PATH} transform="translate(-17 0)" fill={mono ? "currentColor" : `url(#${id})`} />
    </svg>
  )
}
