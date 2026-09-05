/**
 * Three roles, named for what they do. Every face is OFL and is loaded by the
 * consuming app (next/font/google, a Google Fonts link, expo-font); this
 * package ships no font binary and never will. It only defines a slot per
 * role — `--aisocratic-font-body` and friends — that the app fills, with a named
 * fallback stack so an unfilled slot still renders the right face if it is
 * installed, and a sane system face if not.
 *
 *   body     Space Grotesk — running text and UI. Also the `body` default,
 *            so in most places the class is redundant and can be deleted.
 *   display  Newsreader — headings and the wordmark. Only weight 200 (and its
 *            italic) is meant to load, so hierarchy comes from SIZE, never
 *            from a weight class: `font-bold` here only asks the browser to
 *            smear the one weight it has.
 *   code     JetBrains Mono — real monospace, for code and CLI-styled chrome.
 *
 * There is deliberately no `font-mono`: in the codebase this was extracted
 * from, `--font-mono` pointed at the body sans face, so ~1400 `font-mono`
 * classes were silent no-ops and the modules that wanted real monospace had
 * to reach past it by hand. Say `font-body` or `font-code` and mean it.
 */
export type FontRole = "body" | "display" | "code"

export type FontSpec = {
  readonly family: string
  readonly weights: readonly number[]
  readonly italic: boolean
  readonly fallback: string
  /** The custom property the app fills (next/font `variable`, or a plain `:root` rule). */
  readonly slot: `--aisocratic-font-${FontRole}`
  /** Pre-rename slot read as a fallback through the 1.x compatibility window. */
  readonly legacySlot: `--stoa-font-${FontRole}`
  /** Google Fonts family spec, for a `<link>` on a static site. */
  readonly google: string
  readonly license: "OFL-1.1"
}

export const fonts = {
  body: {
    family: "Space Grotesk",
    weights: [400],
    italic: false,
    fallback: "ui-sans-serif, system-ui, sans-serif",
    slot: "--aisocratic-font-body",
    legacySlot: "--stoa-font-body",
    google: "Space+Grotesk:wght@400",
    license: "OFL-1.1",
  },
  display: {
    family: "Newsreader",
    weights: [200],
    italic: true,
    fallback: 'Georgia, "Times New Roman", serif',
    slot: "--aisocratic-font-display",
    legacySlot: "--stoa-font-display",
    google: "Newsreader:ital,opsz,wght@0,6..72,200;1,6..72,200",
    license: "OFL-1.1",
  },
  code: {
    family: "JetBrains Mono",
    weights: [400, 500],
    italic: false,
    fallback: "ui-monospace, SFMono-Regular, Menlo, monospace",
    slot: "--aisocratic-font-code",
    legacySlot: "--stoa-font-code",
    google: "JetBrains+Mono:wght@400;500",
    license: "OFL-1.1",
  },
} as const satisfies Record<FontRole, FontSpec>

/** The CSS `font-family` value for a role: the app's slot first, then the named face, then the system stack. */
export function fontStack(role: FontRole): string {
  const f = fonts[role]
  return `var(${f.slot}, var(${f.legacySlot}, "${f.family}", ${f.fallback}))`
}
