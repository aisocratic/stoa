import { describe, expect, it } from "vitest"

import { type, typeSize, type TypeStep } from "../src/tokens/type.ts"

/**
 * The scale is √φ per step. The px values are hand-rounded, so allow the
 * rounding a real ladder needs (≤ 1px) rather than asserting exact ratios.
 */
describe("golden-ratio type scale", () => {
  const steps = Object.values(type) as TypeStep[]
  it("is √φ between neighbours and φ between alternate steps", () => {
    // A fluid step's rung is its top; its px is the previous rung, where the clamp starts.
    const px = steps.map((s) => s.max ?? s.px)
    for (let i = 1; i < px.length; i++) {
      const ratio = px[i]! / px[i - 1]!
      expect(ratio).toBeGreaterThan(1.2)
      expect(ratio).toBeLessThan(1.35)
    }
    for (let i = 2; i < px.length; i++) {
      expect(Math.abs(px[i]! / px[i - 2]! - 1.618)).toBeLessThan(0.05)
    }
  })

  it("fluid steps clamp to the next rung and emit the exact CSS the site shipped", () => {
    expect(typeSize(type.body)).toBe("0.875rem")
    expect(typeSize(type.title)).toBe("clamp(1.125rem, 1.009rem + 0.476vw, 1.4375rem)")
    expect(typeSize(type.hero)).toBe("clamp(2.9375rem, 2.659rem + 1.143vw, 3.6875rem)")
    expect(typeSize(type.mega)).toBe("clamp(3.6875rem, 3.316rem + 1.524vw, 4.6875rem)")
  })

  it("tightens leading as type grows", () => {
    const lh = steps.map((s) => s.lineHeight)
    for (let i = 2; i < lh.length; i++) expect(lh[i]!).toBeLessThanOrEqual(lh[i - 1]!)
    expect(type.body.lineHeight).toBe(1.618)
  })
})
