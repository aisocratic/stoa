/**
 * The measure every page shares: 72rem of content inside a gutter of 1rem
 * (1.5rem from 768px).
 *
 * The gutter is added ON TOP of the 72rem rather than eaten out of it, so a
 * `page-shell` and a hand-written `px-4 md:px-6 > max-w-6xl mx-auto` pair
 * resolve to the same content box at every width. Writing it the obvious way
 * — cap and gutter on a single element — silently loses 48px to the padding
 * once the viewport is wide enough to hit the cap, which is how pages drift
 * out of alignment with each other.
 *
 * Section rhythm is φ-spaced like the type: 40 · 64 · 104px. The public
 * header is 104px tall and out of flow, so the first section on a page adds
 * that clearance to its own top padding (`Section lead`).
 */
export const shell = {
  measure: "72rem",
  gutter: { base: "1rem", md: "1.5rem" },
  mdBreakpoint: 768,
  section: { sm: 40, md: 64, lg: 104 },
  header: 104,
} as const
