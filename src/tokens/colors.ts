/**
 * Semantic colour roles, light and dark, as raw hex.
 *
 * The consuming app never reaches for a hue — it asks for a role
 * (`bg-background`, `text-muted-foreground`, `border-border`) and the theme
 * answers. Both modes are listed side by side on purpose: a role that exists
 * in one mode and not the other is the bug this file makes impossible.
 *
 * ## The dark palette
 *
 * Body text is #e6e6e6, not #fafafa. Near-white on near-black is ~19:1 — more
 * contrast than ink on paper, and on an emissive panel that reads as
 * halation: the glyphs bloom and smear, worst on thin strokes. Every heading
 * in the system is the display face at weight 200, which is exactly the
 * thin-stroke case. #e6e6e6 is still 15.9:1, more than twice WCAG AAA, and it
 * keeps a 2x step above --muted-foreground so the body/secondary hierarchy
 * holds.
 *
 * Two tokens deliberately keep #fafafa: --primary is a white button SURFACE
 * (dimming it greys every primary button), and --destructive-foreground sits
 * on red, where #fafafa is already only 4.6:1 and dimming breaks AA.
 *
 * ## THREE TEXT ROLES, and only three
 *
 *   --foreground        titles, headings, emphasis     #e6e6e6  15.9:1
 *   --reading           running prose in an article    #c8c8c8  11.8:1
 *   --muted-foreground  chrome: meta, labels, icons    #a1a1aa   7.7:1
 *
 * `--reading` exists because a heading and its own paragraphs were the same
 * colour: everything on an article page resolved to --foreground, so the only
 * thing separating a headline from the body under it was size. Dimming the
 * prose one step is what a printed page does with ink weight, and it is the
 * step the dark theme can actually afford — #c8c8c8 is still 11.8:1, well
 * past AAA, and it leaves --foreground free to mean "this is the top of the
 * hierarchy" instead of "this is text". In light mode the step is
 * deliberately small: ink on paper is near-black, and the point is only to
 * let a heading sit above its own paragraphs, not to grey the page out.
 *
 * It is NOT --muted-foreground, which carries thousands of call sites of
 * badges, placeholders, table meta, timestamps and icon tints. Those want to
 * recede from the interface; body copy wants to be read.
 */
export type Mode = "light" | "dark"
export type ColorPair = { readonly light: string; readonly dark: string }

const pair = (light: string, dark: string): ColorPair => ({ light, dark })

export const colors = {
  background: pair("#ffffff", "#0a0a0a"),
  foreground: pair("#0a0a0a", "#e6e6e6"),
  card: pair("#f8f8f8", "#141414"),
  "card-foreground": pair("#0a0a0a", "#e6e6e6"),
  popover: pair("#ffffff", "#0a0a0a"),
  "popover-foreground": pair("#0a0a0a", "#e6e6e6"),
  primary: pair("#0a0a0a", "#fafafa"),
  "primary-foreground": pair("#ffffff", "#0a0a0a"),
  secondary: pair("#e2e8f0", "#1a1a1a"),
  "secondary-foreground": pair("#0a0a0a", "#e6e6e6"),
  muted: pair("#f1f5f9", "#262626"),
  "muted-foreground": pair("#64748b", "#a1a1aa"),
  /** Running prose in an article, and nothing else. See the file comment. */
  reading: pair("#262626", "#c8c8c8"),
  accent: pair("#d97706", "#fbbf24"),
  "accent-foreground": pair("#ffffff", "#0a0a0a"),
  destructive: pair("#ef4444", "#dc2626"),
  "destructive-foreground": pair("#ffffff", "#fafafa"),
  border: pair("#e2e8f0", "#262626"),
  input: pair("#e2e8f0", "#262626"),
  ring: pair("#d97706", "#fbbf24"),

  /* Categorical series for line/area/bar charts. Single-accent by default:
   * ranked lists stay amber; reach for 2–5 only when series must coexist. */
  "chart-1": pair("#d97706", "#fbbf24"),
  "chart-2": pair("#10b981", "#34d399"),
  "chart-3": pair("#a855f7", "#c084fc"),
  "chart-4": pair("#8b5cf6", "#a78bfa"),
  "chart-5": pair("#ef4444", "#f87171"),

  /* Breakdown ramp for the part-to-whole cards (donut slices, tinted bar
   * lists). Deliberately NOT a multi-hue categorical palette: identity lives
   * in the legend/labels (every breakdown ships counts and shares as text),
   * so the fill only has to separate adjacent marks and rank them. Slot 1 is
   * the amber accent for the lead bucket; slots 2–5 are a slate ramp,
   * strong→faint, assigned in legend order and never cycled.
   *
   * Validated against the card surface (#f8f8f8 / #141414): the slate steps
   * clear adjacent-pair ΔE ≥ 15 for normal vision and CVD in both modes. The
   * faint tail steps fall under 3:1 contrast, so every chart using the ramp
   * must carry visible labels or a legend with figures — identity is never
   * colour alone. --chart-ramp-muted is the near-surface wash reserved for
   * "not reported": a coverage note, not a category, always pinned last.
   *
   * The dark ramp is a selected dark ramp, not an automatic flip: the slate
   * steps run light→dark so the lead buckets stay the brightest, and the
   * "not reported" wash sits just above the surface. */
  "chart-ramp-1": pair("#d97706", "#fbbf24"),
  "chart-ramp-2": pair("#334155", "#e6ebf2"),
  "chart-ramp-3": pair("#64748b", "#9aa8bc"),
  "chart-ramp-4": pair("#94a3b8", "#5f6d82"),
  "chart-ramp-5": pair("#cbd5e1", "#333d4b"),
  "chart-ramp-muted": pair("#eef2f6", "#20262e"),

  /* The one saturated colour in the palette, reserved for the single "join
   * us" CTA in the header. `--primary` is near-black/near-white here, so a
   * filled primary button reads as chrome rather than as an invitation. Dark
   * is lifted well off #7c3aed: on the near-black background the darker
   * violet loses too much contrast against the surrounding chrome. */
  join: pair("#7c3aed", "#8b5cf6"),
  "join-foreground": pair("#ffffff", "#ffffff"),

  /* Status tints for badges, pills and inline indicators. Text sits on a 10%
   * wash of itself over the page, so the numbers that matter are the text
   * colours against --background: 700-weight hues in light (≥ 4.5:1 on
   * white), 400-weight in dark (≥ 7:1 on #0a0a0a). `danger` is
   * --destructive, spelled here so the seven tones are one family. These used
   * to be raw palette classes (`bg-green-500/10 text-green-500`), which was the
   * only colour in the system that ignored the theme. */
  "status-success": pair("#15803d", "#4ade80"),
  "status-warning": pair("#a16207", "#facc15"),
  "status-caution": pair("#c2410c", "#fb923c"),
  "status-danger": pair("#ef4444", "#f87171"),
  "status-info": pair("#1d4ed8", "#60a5fa"),
  "status-highlight": pair("#0e7490", "#22d3ee"),
  "status-accent": pair("#7e22ce", "#c084fc"),

  sidebar: pair("#f8f8f8", "#141414"),
  "sidebar-foreground": pair("#0a0a0a", "#e6e6e6"),
  "sidebar-primary": pair("#d97706", "#fbbf24"),
  "sidebar-primary-foreground": pair("#ffffff", "#0a0a0a"),
  "sidebar-accent": pair("#f1f5f9", "#262626"),
  "sidebar-accent-foreground": pair("#0a0a0a", "#e6e6e6"),
  "sidebar-border": pair("#e2e8f0", "#262626"),
  "sidebar-ring": pair("#d97706", "#fbbf24"),
} as const satisfies Record<string, ColorPair>

export type ColorRole = keyof typeof colors
