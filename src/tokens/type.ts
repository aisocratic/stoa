/**
 * One scale, built on the golden ratio. Neighbouring steps are √φ (1.272)
 * apart, which means every OTHER step is exactly φ:
 *
 *     11 · 14 · 18 · 23 · 29 · 37 · 47 · 59 · 75
 *          └────φ────┘    └───φ───┘   └───φ───┘        (14 · 23 · 37 · 59)
 *     └────φ────┘    └───φ───┘   └───φ───┘             (11 · 18 · 29 · 47 · 75)
 *
 * Anchored at 14 because that is what the site already IS: 14px is the most
 * rendered size on the public pages by a factor of three, not 16. Anchoring
 * at 16 would have enlarged every page to satisfy the maths.
 *
 * Before this existed there was no `--text-*` scale at all, so each page
 * picked from Tailwind's 12 stock steps plus ~30 hand-written `text-[Npx]`
 * values — eleven different display sizes rendering across four pages, and
 * `h2` set nine different ways.
 *
 * Line-heights are paired to each step (Tailwind 4's `--text-*--line-height`)
 * so leading can't drift from size: body is exactly φ, and the ratio
 * tightens toward 1 as the type grows, the way display type wants.
 *
 * The six heading steps are FLUID — each clamps between two adjacent steps
 * on the scale, interpolating from 390px to 1440px of viewport. That is what
 * retires the `text-X md:text-Y` chains: a heading is one class and it is the
 * right size everywhere. The `rem + vw` form (rather than pure vw) is
 * deliberate — it keeps scaling with the reader's own font size.
 */
export const FLUID_RANGE = { from: 390, to: 1440 } as const

export type TypeStep = {
  /** Size at the small end (and the only size for fixed steps), in px. */
  readonly px: number
  /** Size at 1440px for fluid steps. Absent on fixed steps. */
  readonly max?: number
  readonly lineHeight: number
  readonly note: string
}

export const type = {
  micro: { px: 11, lineHeight: 1.45, note: "eyebrows, badges, tracked labels" },
  body: { px: 14, lineHeight: 1.618, note: "body and UI. The anchor. φ" },
  lead: { px: 18, lineHeight: 1.5, note: "intros, standfirsts, large UI, article prose" },
  title: { px: 18, max: 23, lineHeight: 1.35, note: "card headlines" },
  section: { px: 23, max: 29, lineHeight: 1.272, note: "section headings (h2). √φ" },
  page: { px: 29, max: 37, lineHeight: 1.2, note: "feature headlines, article h1" },
  display: { px: 37, max: 47, lineHeight: 1.15, note: "inner-page h1" },
  hero: { px: 47, max: 59, lineHeight: 1.1, note: "top-level page h1" },
  mega: { px: 59, max: 75, lineHeight: 1.05, note: "statement type" },
} as const satisfies Record<string, TypeStep>

export type TypeStepName = keyof typeof type

const rem = (px: number, places = 4) => `${trim(px / 16, places)}rem`
const trim = (n: number, places: number) => String(Number(n.toFixed(places)))

/** The CSS value for a step: a plain rem for fixed steps, a clamp() for fluid ones. */
export function typeSize(step: TypeStep): string {
  if (step.max === undefined) return rem(step.px)
  const slope = (step.max - step.px) / (FLUID_RANGE.to - FLUID_RANGE.from)
  const intercept = step.px - slope * FLUID_RANGE.from
  return `clamp(${rem(step.px)}, ${trim(intercept / 16, 3)}rem + ${trim(slope * 100, 3)}vw, ${rem(step.max)})`
}
