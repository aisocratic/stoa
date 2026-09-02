/**
 * Brand constants that are not theme tokens: the mark's gradient, the logo
 * assets, and the Open Graph card colours that render outside any CSS
 * pipeline.
 *
 * The mark is a ring stroked with a violet→pink gradient. `--join` is the
 * same family flattened to one CTA colour; the two are the only saturated
 * colour on a page, and they should not both appear in the same viewport.
 */
export const brand = {
  name: "AI Socratic",
  url: "https://aisocratic.org",
  gradient: {
    angle: 135,
    stops: [
      { at: 0, color: "#7c3aed" },
      { at: 35, color: "#a855f7" },
      { at: 65, color: "#ec4899" },
      { at: 100, color: "#f472b6" },
    ],
  },
  logo: {
    /** Named for the THEME each belongs to: `light` is dark ink on pale ground, `dark` is white ink on black. */
    light: "https://pub-7a2c36ac409a4be0a469be59c0e02fd6.r2.dev/images/logo/ai-socratic-logo-light",
    dark: "https://pub-7a2c36ac409a4be0a469be59c0e02fd6.r2.dev/images/logo/ai-socratic-logo-dark",
    default: "https://pub-7a2c36ac409a4be0a469be59c0e02fd6.r2.dev/images/logo/ai-socratic-logo",
    formats: ["svg", "png"],
    /** Intrinsic aspect of the lockup (ring + wordmark). */
    viewBox: { width: 2822, height: 796 },
  },
  og: {
    background: "#0a0a0a",
    accentLine: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
    title: "#ffffff",
    wordmark: "#e4e4e7",
    deck: "#a1a1aa",
    footer: "#71717a",
  },
} as const

export function brandGradientCss(direction = `${brand.gradient.angle}deg`): string {
  return `linear-gradient(${direction}, ${brand.gradient.stops.map((s) => `${s.color} ${s.at}%`).join(", ")})`
}
