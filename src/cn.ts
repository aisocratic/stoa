import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

import { type, textStyles } from "./tokens/type.js"

/**
 * The type scale lives in the `text-*` namespace (`text-body`,
 * `text-section`, …), and tailwind-merge does not know about it. Left to its
 * own devices it sorts an unrecognised `text-*` class into the text-COLOUR
 * group, so merging a scale class over a component's classes silently
 * deletes the component's colour:
 *
 *   cn("bg-primary text-primary-foreground", "text-body")
 *     → "bg-primary text-body"        ← the foreground colour is gone
 *
 * That is not hypothetical: it rendered a footer's Subscribe button as white
 * text on a white background, because the button's own
 * `text-primary-foreground` was dropped in favour of a font size.
 *
 * Teaching the merger which `text-*` values are sizes fixes it everywhere at
 * once. The list is derived from the token source, so it cannot drift. The
 * two text styles (`text-nav`, `text-eyebrow`) set a size too, so they join
 * the same group.
 */
export const TYPE_SCALE: readonly string[] = [...Object.keys(type), ...Object.keys(textStyles)]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_SCALE] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
