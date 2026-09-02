# Brand

## The mark

A ring, stroked with the brand gradient:

| stop | colour |
|---|---|
| 0% | `#7c3aed` |
| 35% | `#a855f7` |
| 65% | `#ec4899` |
| 100% | `#f472b6` |

Available as `--brand-gradient` (a `linear-gradient(135deg, …)`), as
`brandGradientCss()` from `@aisocratic/stoa/tokens`, and as the `LogoMark`
component. `--join` (`#7c3aed` / `#8b5cf6` dark) is the same family flattened
to one CTA colour; the gradient and the CTA should not share a viewport.

## The lockup

`Wordmark` renders ring + "AI Socratic" as one inline SVG, wordmark in
`currentColor`. Raster and vector assets, named for the **theme** they belong
to (the `light` mark is dark ink for pale grounds; the `dark` mark is white
for black):

- `…/images/logo/ai-socratic-logo-light.{svg,png}`
- `…/images/logo/ai-socratic-logo-dark.{svg,png}`
- `…/images/logo/ai-socratic-logo.{svg,png}`

Base URL in `brand.logo` from `@aisocratic/stoa/tokens`.

## Favicon

`LogoMark` at 32px, or the stroke-only version: a circle `r=12` in a 32
viewBox, `stroke-width 4`, stroke = the gradient. The Apple icon is the same
ring on a white `rx=40` squircle at 180px.

## Open Graph cards

Rendered outside the CSS pipeline, so the colours are constants in
`brand.og`: ground `#0a0a0a`, a 4px top accent line
`linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)`, title `#ffffff` at 56px
with `-0.03em` tracking, wordmark `#e4e4e7`, deck `#a1a1aa`, footer `#71717a`.
