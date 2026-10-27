import { describe, expect, it } from "vitest"

import { deltaE } from "../src/tokens/color-math.ts"
import { colors, resolveColor, roleContrast, type ColorRole, type Mode } from "../src/tokens/colors.ts"

describe.each<Mode>(["light", "dark"])("%s mode contrast", (mode) => {
  it("the three text roles clear their bars on the page ground", () => {
    expect(roleContrast("foreground", "background", mode)).toBeGreaterThanOrEqual(7)
    expect(roleContrast("reading", "background", mode)).toBeGreaterThanOrEqual(7)
    expect(roleContrast("muted-foreground", "background", mode)).toBeGreaterThanOrEqual(4.5)
  })

  it("titles and prose stay AAA on a card, and chrome text reaches AA there too", () => {
    expect(roleContrast("foreground", "card", mode)).toBeGreaterThanOrEqual(7)
    expect(roleContrast("reading", "card", mode)).toBeGreaterThanOrEqual(7)
    // Small labels must remain readable on every common surface.
    expect(roleContrast("muted-foreground", "card", mode)).toBeGreaterThanOrEqual(4.5)
    expect(roleContrast("muted-foreground", "muted", mode)).toBeGreaterThanOrEqual(4.5)
    expect(roleContrast("muted-foreground", "secondary", mode)).toBeGreaterThanOrEqual(4.5)
  })

  it("filled controls are readable", () => {
    expect(roleContrast("primary-foreground", "primary", mode)).toBeGreaterThanOrEqual(4.5)
    // Destructive labels must clear the normal-text AA threshold.
    expect(roleContrast("destructive-foreground", "destructive", mode)).toBeGreaterThanOrEqual(4.5)
    expect(roleContrast("join-foreground", "join", mode)).toBeGreaterThanOrEqual(3)
    expect(roleContrast("accent-foreground", "accent", mode)).toBeGreaterThanOrEqual(3)
  })

  it("every status tone is readable as text on the page and on a card", () => {
    for (const tone of ["success", "warning", "caution", "danger", "info", "highlight", "accent"] as const) {
      expect(roleContrast(`status-${tone}`, "background", mode), tone).toBeGreaterThanOrEqual(4.5)
      expect(roleContrast(`status-${tone}`, "card", mode), `${tone} on card`).toBeGreaterThanOrEqual(4.2)
    }
  })

  it("the breakdown ramp steps are distinguishable neighbours", () => {
    const ramp = [1, 2, 3, 4, 5, 6, 7].map((n) => `chart-ramp-${n}` as ColorRole)
    for (let i = 1; i < ramp.length; i++) {
      const [a, b] = [ramp[i - 1]!, ramp[i]!]
      expect(deltaE(resolveColor(a, mode), resolveColor(b, mode)), `${a} vs ${b}`).toBeGreaterThanOrEqual(20)
      expect(roleContrast(a, b, mode), `${a} vs ${b}`).toBeGreaterThanOrEqual(1.3)
    }
    expect(roleContrast("chart-ramp-7", "chart-ramp-muted", mode)).toBeGreaterThanOrEqual(1.3)
  })

  it("the breakdown ramp is amber, so a ring reads as one colour", () => {
    for (let n = 1; n <= 7; n++) {
      const def = colors[`chart-ramp-${n}` as ColorRole]
      expect("light" in def && def.light.startsWith("amber.") && def.dark.startsWith("amber."), `chart-ramp-${n}`).toBe(true)
    }
  })

  it("dark body text is dimmed against halation, not maxed out", () => {
    if (mode === "dark") {
      const ratio = roleContrast("foreground", "background", "dark")
      expect(ratio).toBeLessThan(17)
      // The lifted charcoal page yields ~14.76:1, still comfortably above AAA.
      expect(ratio).toBeGreaterThan(14)
    }
  })

  it("reading sits between foreground and muted-foreground", () => {
    const fg = roleContrast("foreground", "background", mode)
    const reading = roleContrast("reading", "background", mode)
    const muted = roleContrast("muted-foreground", "background", mode)
    expect(reading).toBeLessThan(fg)
    expect(reading).toBeGreaterThan(muted)
  })
})

it("uses Anthropic ivory and oat in light mode and retains the dark reading colour", () => {
  expect(resolveColor("background", "light")).toBe("#f0eee6")
  expect(resolveColor("card", "light")).toBe("#faf9f5")
  expect(resolveColor("foreground", "light")).toBe("#141413")
  expect(resolveColor("reading", "light")).toBe("#3d3d3a")
  expect(resolveColor("border", "light")).toBe("#e3dacc")
  expect(resolveColor("muted-foreground", "light")).toBe("#5e5d59")
  expect(resolveColor("reading", "dark")).toBe("#c8c8c8")
})

it("every role resolves to a hex in both modes", () => {
  for (const role of Object.keys(colors) as ColorRole[]) {
    for (const mode of ["light", "dark"] as const) {
      expect(resolveColor(role, mode), `${role} ${mode}`).toMatch(/^#[0-9a-f]{6}$/)
    }
  }
})
