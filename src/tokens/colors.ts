/**
 * Semantic colour roles — the only colours that become classes.
 *
 * A role names a job (`bg-background`, `text-muted-foreground`,
 * `border-border`) and points at a palette entry per mode. The consuming app
 * never reaches for a hue; the theme answers. Two roles that share a job
 * share a palette entry, which is what keeps `border` and `secondary` from
 * drifting one hex apart the way they used to.
 *
 * Light surfaces and warm text use Anthropic's ivory/oat palette; dark
 * retains aisocratic.org's ink surfaces. The page is ivory-medium, cards
 * are ivory-light, and oat borders define controls without stark white.
 * Amber accents, violet membership CTAs and status colors retain their
 * semantic roles. Destructive fills use red.600 for readable white labels.
 * Chart ramps always require text labels.
 */
import { contrast, mixOklab } from "./color-math.js"
import { paletteHex, paletteVar, type PaletteRef } from "./palette.js"

export type Mode = "light" | "dark"

/** A role that points at a palette entry per mode. */
export type ColorPair = { readonly light: PaletteRef; readonly dark: PaletteRef }
/** A role derived from two other roles, as CSS `color-mix(in oklab, of <amount>%, with)`. */
export type ColorMix = { readonly mix: { readonly of: string; readonly with: string; readonly amount: number } }
export type ColorDef = ColorPair | ColorMix

const pair = (light: PaletteRef, dark: PaletteRef): ColorPair => ({ light, dark })

export const colors = {
  /* -------------------------------------------------------------- neutrals */
  background: pair("oat.2", "ink.1"),
  foreground: pair("oat.12", "ink.12"),
  reading: pair("oat.11", "neutral.300"),
  "muted-foreground": pair("oat.10", "ink.11"),
  /** Boxed surfaces: one step off the page. */
  card: pair("oat.1", "ink.2"),
  /** Floating surfaces use the raised card ground with a defining border. */
  popover: pair("oat.1", "ink.1"),
  /** Subdued fills — table hover, neutral badges, skeletons. */
  muted: pair("oat.3", "ink.4"),
  /** Secondary buttons and the hover fill of ghost/outline controls. */
  secondary: pair("oat.3", "ink.3"),
  border: pair("oat.4", "ink.4"),

  /* -------------------------------------------------------------- controls */
  /** Near-monochrome by design: the page inverted. */
  primary: pair("oat.12", "neutral.50"),
  "primary-foreground": pair("oat.1", "ink.1"),
  accent: pair("amber.600", "amber.400"),
  "accent-foreground": pair("white", "ink.1"),
  destructive: pair("red.600", "red.600"),
  "destructive-foreground": pair("white", "white"),
  /** Reserved for the single "join us" CTA in the header. */
  join: pair("violet.600", "violet.500"),
  "join-foreground": pair("white", "white"),

  /* ---------------------------------------------------------------- status */
  "status-success": pair("green.800", "green.400"),
  "status-warning": pair("yellow.800", "yellow.400"),
  "status-caution": pair("orange.800", "orange.400"),
  "status-danger": pair("red.700", "red.400"),
  "status-info": pair("blue.700", "blue.400"),
  "status-highlight": pair("cyan.700", "cyan.400"),
  "status-accent": pair("purple.700", "purple.400"),

  /* ---------------------------------------------------------------- charts */
  "chart-1": pair("amber.600", "amber.400"),
  "chart-2": pair("green.800", "green.400"),
  "chart-3": pair("purple.700", "purple.400"),
  "chart-4": pair("violet.600", "violet.500"),
  "chart-5": pair("red.700", "red.400"),
  "chart-ramp-1": pair("amber.600", "amber.400"),
  "chart-ramp-2": pair("oat.12", "ink.12"),
  "chart-ramp-3": pair("oat.10", "ink.10"),
  "chart-ramp-4": pair("oat.8", "ink.8"),
  "chart-ramp-5": pair("oat.6", "ink.6"),
  "chart-ramp-muted": pair("oat.3", "ink.3"),
} as const satisfies Record<string, ColorDef>

export type ColorRole = keyof typeof colors

/**
 * Names shadcn components and older call sites still use, kept as plain
 * `var()` aliases of a role so `npx shadcn add` output compiles. They add
 * no colour; new code says the role.
 */
export const colorAliases = {
  "card-foreground": "foreground",
  "popover-foreground": "foreground",
  "secondary-foreground": "foreground",
  input: "border",
  ring: "accent",
} as const satisfies Record<string, ColorRole>

export type ColorAlias = keyof typeof colorAliases

export const isMix = (def: ColorDef): def is ColorMix => "mix" in def

/** The hex a role paints in a mode — mixes resolved the way the browser resolves them. */
export function resolveColor(role: ColorRole | ColorAlias, mode: Mode): string {
  const def = colors[(role in colorAliases ? colorAliases[role as ColorAlias] : role) as ColorRole]
  if (isMix(def))
    return mixOklab(resolveColor(def.mix.of as ColorRole, mode), resolveColor(def.mix.with as ColorRole, mode), def.mix.amount)
  return paletteHex(def[mode])
}

/** The CSS value a role is emitted with in a theme block. */
export function colorCss(role: ColorRole, mode: Mode): string {
  const def = colors[role]
  if (isMix(def)) return `color-mix(in oklab, var(--${def.mix.of}) ${def.mix.amount}%, var(--${def.mix.with}))`
  return `var(${paletteVar(def[mode])})`
}

/** Contrast between two roles in a mode, for tests and the gallery. */
export function roleContrast(a: ColorRole | ColorAlias, b: ColorRole | ColorAlias, mode: Mode): number {
  return contrast(resolveColor(a, mode), resolveColor(b, mode))
}
