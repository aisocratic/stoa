import { describe, expect, it } from "vitest"

import { cn, TYPE_SCALE } from "../src/cn.ts"
import { type, textStyles } from "../src/tokens/type.ts"

describe("cn() and the type scale", () => {
  it("keeps a text colour when a scale step is merged over it", () => {
    // The white-on-white Subscribe button, never again.
    expect(cn("bg-primary text-primary-foreground", "text-body")).toBe("bg-primary text-primary-foreground text-body")
  })

  it("still lets a later scale step replace an earlier one", () => {
    expect(cn("text-body", "text-lead")).toBe("text-lead")
  })

  it("still lets a later colour replace an earlier colour", () => {
    expect(cn("text-foreground text-body", "text-muted-foreground")).toBe("text-body text-muted-foreground")
  })

  it("derives TYPE_SCALE from the token source", () => {
    expect(TYPE_SCALE).toEqual([...Object.keys(type), ...Object.keys(textStyles)])
    expect(TYPE_SCALE).toEqual(["micro", "body", "lead", "title", "section", "page", "display", "hero", "mega", "nav", "eyebrow"])
  })
})
