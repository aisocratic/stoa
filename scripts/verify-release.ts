// Refuse to publish when the git tag and package.json disagree.
import { readFileSync } from "node:fs"

const tag = process.env.GITHUB_REF_NAME ?? ""
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string }
if (tag !== `v${version}`) {
  console.error(`tag ${tag || "(none)"} does not match package.json version v${version}`)
  process.exit(1)
}
console.log(`release v${version} ok`)
