/**
 * Two radii. A control is 10px, a surface is 16px, and a pill is
 * `rounded-full`. That is the whole ladder.
 *
 * The previous system had four rungs on a φ ladder (6 · 10 · 16 · 26) and
 * before that eight values in use with no rule about which. In practice only
 * two questions ever get asked — "is this a button or a card?" — so the
 * ladder is two rungs, named the way shadcn output already spells them:
 *
 *   rounded-md   10px   controls: buttons, inputs, badges, menu items, tabs
 *   rounded-xl   16px   surfaces: cards, dialogs, popovers, panels
 *
 * Every other Tailwind radius name is an alias, so third-party markup lands
 * on a rung instead of off the ladder: `rounded` `-xs` `-sm` `-lg` → 10px,
 * `-2xl` → 16px. `rounded-3xl` and up do not exist.
 */
export const radii = {
  /** control */
  md: 10,
  /** surface */
  xl: 16,
} as const

export type RadiusRung = keyof typeof radii

/** Tailwind names that resolve to a rung. `DEFAULT` is bare `rounded`. */
export const radiusAliases = {
  DEFAULT: "md",
  xs: "md",
  sm: "md",
  lg: "md",
  "2xl": "xl",
} as const satisfies Record<string, RadiusRung>
