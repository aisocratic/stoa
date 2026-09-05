import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(import.meta.dirname, "..")
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))

/** Runs against the built package — `pnpm build` first. */
describe("dist", () => {
  it("has been built before distribution tests run", () => {
    expect(existsSync(join(ROOT, "dist/index.js")), "run `pnpm build` before the test suite").toBe(true)
  })

  it("every exports target exists", () => {
    for (const [sub, target] of Object.entries(pkg.exports as Record<string, string | { default: string }>)) {
      const file = typeof target === "string" ? target : target.default
      if (file.includes("*")) continue
      expect(existsSync(join(ROOT, file)), `${sub} → ${file}`).toBe(true)
    }
  })

  it("every component wildcard target has JavaScript and types", () => {
    for (const source of readdirSync(join(ROOT, "src/components")).filter((file) => file.endsWith(".tsx"))) {
      const name = source.replace(/\.tsx$/, "")
      expect(existsSync(join(ROOT, "dist/components", `${name}.js`)), name).toBe(true)
      expect(existsSync(join(ROOT, "dist/components", `${name}.d.ts`)), name).toBe(true)
    }
  })

  it("keeps the compiled distribution below its size budget", () => {
    const bytes = (dir: string): number =>
      readdirSync(dir, { withFileTypes: true }).reduce(
        (total, entry) => total + (entry.isDirectory() ? bytes(join(dir, entry.name)) : readFileSync(join(dir, entry.name)).byteLength),
        0,
      )
    expect(bytes(join(ROOT, "dist"))).toBeLessThan(400_000)
  })

  it("resolves the root and every component through the public package exports", async () => {
    await expect(import("@aisocratic/design")).resolves.toBeTruthy()
    for (const source of readdirSync(join(ROOT, "src/components")).filter((file) => file.endsWith(".tsx"))) {
      const name = source.replace(/\.tsx$/, "")
      await expect(import(`@aisocratic/design/components/${name}`), name).resolves.toBeTruthy()
    }
  })

  it("client components keep their directive", () => {
    const src = readdirSync(join(ROOT, "src/components")).filter((f) => f.endsWith(".tsx"))
    for (const f of src) {
      const source = readFileSync(join(ROOT, "src/components", f), "utf8")
      if (!/^['"]use client['"]/.test(source)) continue
      const out = readFileSync(join(ROOT, "dist/components", f.replace(/\.tsx$/, ".js")), "utf8")
      expect(out.startsWith('"use client"') || out.startsWith("'use client'"), f).toBe(true)
    }
  })

  it("has no unresolved app aliases", () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith(".js") ? [join(dir, d.name)] : [],
      )
    for (const file of walk(join(ROOT, "dist"))) {
      expect(readFileSync(file, "utf8").includes('"@/'), file).toBe(false)
    }
  })

  it("tailwind.css carries the source hint and the utilities", () => {
    const css = readFileSync(join(ROOT, "dist/css/tailwind.css"), "utf8")
    expect(css).toContain('@source "../**/*.js"')
    expect(css).toContain("@utility page-shell")
    expect(css).toContain("@custom-variant dark")
    expect(css).toContain("--color-status-success: var(--status-success)")
    expect(css.match(/color-scheme: dark;/g)?.length).toBe(2)
  })

  it("the static site import includes tokens and shared page chrome without a build tool", () => {
    const css = readFileSync(join(ROOT, "dist/css/site.css"), "utf8")
    expect(css.startsWith(readFileSync(join(ROOT, "dist/css/tokens.css"), "utf8"))).toBe(true)
    expect(css).not.toMatch(/@(theme|utility|source|custom-variant|apply|import)/)
    for (const selector of [".page-shell", ".site-header", ".project-hero", ".site-footer", ".btn", ".mobile-menu"]) {
      expect(css).toContain(selector)
    }
  })

  it("tokens.css is plain CSS with no Tailwind at-rules", () => {
    const css = readFileSync(join(ROOT, "dist/css/tokens.css"), "utf8")
    expect(css).not.toMatch(/@(theme|utility|source|custom-variant|apply)/)
    expect(css).toContain("--text-body: 0.875rem;")
    expect(css).toContain("--font-display: var(--aisocratic-font-display, var(--stoa-font-display,")
  })
})
