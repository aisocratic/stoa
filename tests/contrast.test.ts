import { describe, expect, it } from "vitest"

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
    const ramp = ["chart-ramp-2", "chart-ramp-3", "chart-ramp-4", "chart-ramp-5", "chart-ramp-muted"] as const
    for (let i = 1; i < ramp.length; i++) {
      expect(roleContrast(ramp[i - 1]!, ramp[i]!, mode), `${ramp[i - 1]} vs ${ramp[i]}`).toBeGreaterThanOrEqual(1.3)
    }
  })

  it("dark body text is dimmed against halation, not maxed out", () => {
    if (mode === "dark") {
      const ratio = roleContrast("foreground", "background", "dark")
      expect(ratio).toBeLessThan(17)
      expect(ratio).toBeGreaterThan(15)
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

it("uses the website page, card and reading colours", () => {
  expect(resolveColor("background", "light")).toBe("#ffffff")
  expect(resolveColor("card", "light")).toBe("#f8f8f8")
  expect(resolveColor("foreground", "light")).toBe("#0a0a0a")
  expect(resolveColor("reading", "light")).toBe("#262626")
  expect(resolveColor("reading", "dark")).toBe("#c8c8c8")
})

it("every role resolves to a hex in both modes", () => {
  for (const role of Object.keys(colors) as ColorRole[]) {
    for (const mode of ["light", "dark"] as const) {
      expect(resolveColor(role, mode), `${role} ${mode}`).toMatch(/^#[0-9a-f]{6}$/)
    }
  }
})
