import { describe, expect, it } from "vitest"

import { colors, colorAliases, isMix, type ColorRole } from "../src/tokens/colors.ts"
import { luminance } from "../src/tokens/color-math.ts"
import { palette, paletteEntries, paletteHex } from "../src/tokens/palette.ts"
import { radii, radiusAliases } from "../src/tokens/radii.ts"

describe("palette", () => {
  it("names every hex exactly once", () => {
    const hexes = paletteEntries().map(([, hex]) => hex)
    expect(new Set(hexes).size).toBe(hexes.length)
  })

  it("keeps website and optional warm primitives bounded", () => {
    expect(paletteEntries().length).toBeLessThan(64)
  })

  it.each(["oat", "ink"] as const)("%s runs monotonically from step 1 to 12", (scale) => {
    const steps = Object.values(palette[scale])
    expect(steps).toHaveLength(12)
    const lum = steps.map(luminance)
    for (let i = 1; i < lum.length; i++) {
      if (scale === "oat") expect(lum[i]!, `oat ${i + 1}`).toBeLessThan(lum[i - 1]!)
      else expect(lum[i]!, `ink ${i + 1}`).toBeGreaterThan(lum[i - 1]!)
    }
  })
})

describe("roles", () => {
  it("only reference the palette or another role", () => {
    for (const [role, def] of Object.entries(colors)) {
      if (isMix(def)) {
        expect(def.mix.of in colors, role).toBe(true)
        expect(def.mix.with in colors, role).toBe(true)
      } else {
        expect(paletteHex(def.light), `${role} light`).toMatch(/^#/)
        expect(paletteHex(def.dark), `${role} dark`).toMatch(/^#/)
      }
    }
  })

  it("aliases point at roles, never at the palette", () => {
    for (const [alias, role] of Object.entries(colorAliases)) {
      expect(role in colors, alias).toBe(true)
      expect(alias in colors, alias).toBe(false)
    }
  })

  it("carry no sidebar family", () => {
    expect((Object.keys(colors) as ColorRole[]).filter((r) => r.startsWith("sidebar"))).toEqual([])
  })
})

describe("radii", () => {
  it("has exactly two rungs and every alias lands on one", () => {
    expect(Object.keys(radii)).toEqual(["md", "xl"])
    for (const rung of Object.values(radiusAliases)) expect(rung in radii).toBe(true)
  })
})
