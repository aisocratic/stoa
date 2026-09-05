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
 * `oat` supplies the warm light theme and `ink` the dark theme. Both follow Radix's step
 * meanings, so a step number says what it is for in either mode:
 *
 *    1  app background            7  hovered border
 *    2  subtle background (card)  8  strong border, placeholder
 *    3  UI element background     9  solid fill
 *    4  hovered element, border  10  hovered solid
 *    5  active element           11  low-contrast text (chrome)
 *    6  subtle border            12  high-contrast text
 *
 * The light theme uses Anthropic's measured ivory/oat surfaces and warm ink:
 * 1 ivory-light #faf9f5; 2 ivory-medium #f0eee6; 3 ivory-dark #e8e6dc;
 * 4 oat #e3dacc; 10 slate-light #5e5d59; 11 slate-medium #3d3d3a;
 * 12 slate-dark #141413. Sampled from https://www.anthropic.com/ on
 * 2026-09-04. The page uses step 2, cards step 1. Intervening steps preserve
 * a monotonic ramp. Legacy neutral/slate primitives remain for overrides.
 * Dark keeps aisocratic.org's page #0a0a0a, card #141414, text #e6e6e6.
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

  /** Legacy cool surfaces, available for consumer overrides. */
  neutral: { 50: "#fafafa", 100: "#f8f8f8", 300: "#c8c8c8" },
  slate: { 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155" },

  oat: {
    1: "#faf9f5",
    2: "#f0eee6",
    3: "#e8e6dc",
    4: "#e3dacc",
    5: "#d4cdbf",
    6: "#c6bfb0",
    7: "#b1aa9c",
    8: "#928b7f",
    9: "#797469",
    10: "#5e5d59",
    11: "#3d3d3a",
    12: "#141413",
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
  orange: { 400: "#fb923c", 700: "#c2410c", 800: "#9a3412" },
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
