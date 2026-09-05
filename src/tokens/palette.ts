/**
 * The primitive palette: every colour the system can paint, each hex exactly
 * once. Nothing here is a Tailwind utility — `bg-oat-3` does not exist. The
 * semantic roles in `colors.ts` reference these by name, and only the roles
 * become classes. That is the two-layer model Radix Colors, Primer and
 * Material use: a small set of *global* colours, and *alias* tokens that give
 * them a job.
 *
 * ## Neutrals: two 12-step scales, Radix numbering
 *
 * `neutral` and `slate` supply the website light theme. `oat` is an optional
 * warm neutral, `ink` the dark one. Both follow Radix's step
 * meanings, so a step number says what it is for in either mode:
 *
 *    1  app background            7  hovered border
 *    2  subtle background (card)  8  strong border, placeholder
 *    3  UI element background     9  solid fill
 *    4  hovered element, border  10  hovered solid
 *    5  active element           11  low-contrast text (chrome)
 *    6  subtle border            12  high-contrast text
 *
 * The optional warm scale is *oat*: hue 85°, chroma ~0.015 in OKLCH,
 * tapering as it darkens. Page and card sit on the warm end (#f7f2e8,
 * #f0ebdf); text is a warm near-black rather than #0a0a0a. The dark scale
 * keeps the values aisocratic.org has always shipped (#0a0a0a page, #141414
 * card, #e6e6e6 text — see the halation note in colors.ts) and fills in the
 * steps between them.
 *
 * ## Hues: Tailwind weights
 *
 * Every chromatic value IS a Tailwind palette colour, so it is named by its
 * Tailwind weight — `amber.600` is what anyone reading the code expects it
 * to be. Each hue carries exactly the weights the roles need: the deep one
 * reads as text on oat (≥ 4.5:1), the 400 reads as text on ink.
 */
export const palette = {
  white: "#ffffff",

  /** Website surfaces; oat remains available for an optional warm theme. */
  neutral: { 50: "#fafafa", 100: "#f8f8f8", 300: "#c8c8c8" },
  slate: { 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155" },

  oat: {
    1: "#f7f2e8",
    2: "#f0ebdf",
    3: "#e8e2d6",
    4: "#dfd8cb",
    5: "#d4cdbf",
    6: "#c6bfb0",
    7: "#b1aa9c",
    8: "#928b7f",
    9: "#797469",
    10: "#676359",
    11: "#56524a",
    12: "#1f1d18",
  },

  ink: {
    1: "#0a0a0a",
    2: "#141414",
    3: "#1a1a1a",
    4: "#262626",
    5: "#2e2e2e",
    6: "#383838",
    7: "#474747",
    8: "#5c5c5c",
    9: "#737373",
    10: "#8a8a8a",
    11: "#a1a1aa",
    12: "#e6e6e6",
  },

  /** The accent. 600 on oat, 400 on ink. */
  amber: { 400: "#fbbf24", 600: "#d97706" },
  /** The one saturated CTA colour (`--join`) and the brand ring's start. */
  violet: { 500: "#8b5cf6", 600: "#7c3aed" },
  /** 600 is the destructive fill; 700 is red as text on oat. */
  red: { 400: "#f87171", 600: "#dc2626", 700: "#b91c1c" },
  green: { 400: "#4ade80", 800: "#166534" },
  yellow: { 400: "#facc15", 800: "#854d0e" },
  orange: { 400: "#fb923c", 700: "#c2410c" },
  blue: { 400: "#60a5fa", 700: "#1d4ed8" },
  cyan: { 400: "#22d3ee", 700: "#0e7490" },
  purple: { 400: "#c084fc", 700: "#7e22ce" },
} as const

type Scales = Omit<typeof palette, "white">
type Ref<S extends keyof Scales> = `${S}.${Extract<keyof Scales[S], number>}`

/** A name in the palette: `"white"`, `"oat.3"`, `"amber.600"`, … */
export type PaletteRef = "white" | { [S in keyof Scales]: Ref<S> }[keyof Scales]

/** The hex behind a palette name. */
export function paletteHex(ref: PaletteRef): string {
  if (ref === "white") return palette.white
  const [scale, step] = ref.split(".") as [keyof Scales, string]
  const hex = (palette[scale] as Record<string, string>)[step]
  if (!hex) throw new Error(`Unknown palette ref: ${ref}`)
  return hex
}

/** Every palette entry as `[ref, hex]`, in declaration order. */
export function paletteEntries(): [PaletteRef, string][] {
  const out: [PaletteRef, string][] = [["white", palette.white]]
  for (const [scale, steps] of Object.entries(palette)) {
    if (typeof steps === "string") continue
    for (const [step, hex] of Object.entries(steps)) out.push([`${scale}.${step}` as PaletteRef, hex])
  }
  return out
}

/** The CSS custom property a palette name is emitted as: `oat.3` → `--oat-3`. */
export const paletteVar = (ref: PaletteRef) => `--${ref.replace(".", "-")}`
