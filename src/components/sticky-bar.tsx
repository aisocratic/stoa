import type { ComponentProps } from "react"

import { cn } from "../cn.js"

/**
 * Pins a section nav / filter toolbar to the top of the viewport while the
 * content below scrolls. The bar spans its own container, so it stays
 * correct inside grid columns and embedded tables; the translucent
 * background and blur keep it legible without a standing border in the
 * unpinned state. `z-30` sits under an `AdminShell` sidebar (z-50) and its
 * overlay (z-40) but over page content.
 */
export function StickyBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("sticky top-0 z-30 bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80", className)}
      {...props}
    />
  )
}

/**
 * The offset a sticky rail beside a `StickyBar` uses to clear it. One value;
 * do not invent a fifth `top-*`. `self-start` keeps the rail from stretching
 * to the grid row and defeating `sticky`.
 */
export const stickyRailClass = "lg:sticky lg:top-16 self-start"
