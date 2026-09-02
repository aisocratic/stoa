import { readFileSync } from "node:fs"
import { join } from "node:path"
import { expect, it } from "vitest"

const ROOT = join(import.meta.dirname, "..")

it("the current version has release notes", () => {
  const { version } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))
  const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8")
  expect(changelog).toContain(`## [${version}]`)
})
