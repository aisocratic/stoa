import { describe, expect, it } from "vitest"

import { colors, type Mode } from "../src/tokens/colors.ts"

/** WCAG 2.x relative luminance and contrast ratio. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (l1 + 0.05) / (l2 + 0.05)
}

const c = (role: keyof typeof colors, mode: Mode) => colors[role][mode]

describe.each<Mode>(["light", "dark"])("%s mode contrast", (mode) => {
  it("the three text roles clear their bars on the page ground", () => {
    expect(contrast(c("foreground", mode), c("background", mode))).toBeGreaterThanOrEqual(7)
    expect(contrast(c("reading", mode), c("background", mode))).toBeGreaterThanOrEqual(7)
    expect(contrast(c("muted-foreground", mode), c("background", mode))).toBeGreaterThanOrEqual(4.5)
  })

  it("titles and prose stay AAA on a card", () => {
    expect(contrast(c("foreground", mode), c("card", mode))).toBeGreaterThanOrEqual(7)
    expect(contrast(c("reading", mode), c("card", mode))).toBeGreaterThanOrEqual(7)
  })

  it("filled controls are readable", () => {
    expect(contrast(c("primary-foreground", mode), c("primary", mode))).toBeGreaterThanOrEqual(4.5)
    // Button labels are bold UI text at 14px+: the AA bar for large text / UI
    // components is 3:1. White on the red (3.8 light / 4.6 dark) and on the
    // violet CTA (4.2–4.8) clear it; they do not reach 4.5, and that is the
    // reason --destructive-foreground keeps #fafafa in dark instead of dimming.
    expect(contrast(c("destructive-foreground", mode), c("destructive", mode))).toBeGreaterThanOrEqual(3)
    expect(contrast(c("join-foreground", mode), c("join", mode))).toBeGreaterThanOrEqual(3)
  })

  it("every status tone is readable as text on the page", () => {
    for (const tone of ["success", "warning", "caution", "info", "highlight", "accent"] as const) {
      expect(contrast(c(`status-${tone}`, mode), c("background", mode)), tone).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("dark body text is dimmed against halation, not maxed out", () => {
    if (mode === "dark") {
      const ratio = contrast(c("foreground", "dark"), c("background", "dark"))
      expect(ratio).toBeLessThan(17)
      expect(ratio).toBeGreaterThan(15)
    }
  })
})

// Light --muted-foreground on --card is 4.48:1, a hair under AA. Changing it
// is a visible change and is not part of the extraction.
it.todo("light muted-foreground reaches 4.5:1 on the card surface (currently 4.48)")
