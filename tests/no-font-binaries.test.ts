import { execFileSync } from "node:child_process"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(import.meta.dirname, "..")
const git = (...args: string[]) => {
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" })
  } catch (error) {
    const { status, stderr } = error as { status?: number; stderr?: string }
    if (status === 1) return "" // git grep: no match
    throw new Error(stderr || String(error))
  }
}

/**
 * Stoa is MIT and every face it names is OFL, loaded by the consuming app.
 * The system this was extracted from shipped a licensed Fontshare face as
 * woff2 files; a font binary in this tree would be redistribution we have no
 * right to do. The correct number of font files here is zero, forever.
 */
describe("license-encumbered assets", () => {
  it("tracks no font binaries", () => {
    const fonts = git("ls-files").split("\n").filter((f) => /\.(woff2?|ttf|otf|eot)$/i.test(f))
    expect(fonts).toEqual([])
  })

  it("never mentions the licensed display face", () => {
    const hits = git("grep", "-il", "sentient", "--", ".", ":!tests/no-font-binaries.test.ts", ":!CHANGELOG.md")
    expect(hits.trim()).toBe("")
  })
})
