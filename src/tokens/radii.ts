/**
 * Eight effective corner radii were in use (4, 6, 8, 10, 14, 16, 24, full)
 * across ~860 elements, with no rule about which. These are four rungs of the
 * same φ ladder the type scale uses, anchored on the base (10px):
 *
 *     6 · 10 · 16 · 26          (÷φ, base, ×φ, ×φ²)
 *
 * `md` is kept only as an alias of the base so legacy call sites don't have
 * to change in the same pass — 8px is not a rung. Bare `rounded` (4px) is
 * off-ladder: use `rounded-sm`.
 */
export const radii = {
  base: 10,
  sm: 6,
  lg: 10,
  xl: 16,
  "2xl": 26,
} as const

export type RadiusRung = keyof typeof radii
