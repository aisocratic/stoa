import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(import.meta.dirname, "..")
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))

/** Runs against the built package — `pnpm build` first. */
describe("dist", () => {
  const built = existsSync(join(ROOT, "dist/index.js"))

  it.skipIf(!built)("every exports target exists", () => {
    for (const [sub, target] of Object.entries(pkg.exports as Record<string, string | { default: string }>)) {
      const file = typeof target === "string" ? target : target.default
      if (file.includes("*")) continue
      expect(existsSync(join(ROOT, file)), `${sub} → ${file}`).toBe(true)
    }
  })

  it.skipIf(!built)("client components keep their directive", () => {
    const src = readdirSync(join(ROOT, "src/components")).filter((f) => f.endsWith(".tsx"))
    for (const f of src) {
      const source = readFileSync(join(ROOT, "src/components", f), "utf8")
      if (!/^['"]use client['"]/.test(source)) continue
      const out = readFileSync(join(ROOT, "dist/components", f.replace(/\.tsx$/, ".js")), "utf8")
      expect(out.startsWith('"use client"') || out.startsWith("'use client'"), f).toBe(true)
    }
  })

  it.skipIf(!built)("has no unresolved app aliases", () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith(".js") ? [join(dir, d.name)] : [],
      )
    for (const file of walk(join(ROOT, "dist"))) {
      expect(readFileSync(file, "utf8").includes('"@/'), file).toBe(false)
    }
  })

  it.skipIf(!built)("tailwind.css carries the source hint and the utilities", () => {
    const css = readFileSync(join(ROOT, "dist/css/tailwind.css"), "utf8")
    expect(css).toContain('@source "../**/*.js"')
    expect(css).toContain("@utility page-shell")
    expect(css).toContain("@custom-variant dark")
    expect(css).toContain("--color-status-success: var(--status-success)")
    expect(css.match(/color-scheme: dark;/g)?.length).toBe(2)
  })

  it.skipIf(!built)("tokens.css is plain CSS with no Tailwind at-rules", () => {
    const css = readFileSync(join(ROOT, "dist/css/tokens.css"), "utf8")
    expect(css).not.toMatch(/@(theme|utility|source|custom-variant|apply)/)
    expect(css).toContain("--text-body: 0.875rem;")
    expect(css).toContain("--font-display: var(--stoa-font-display,")
  })
})
