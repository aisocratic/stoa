# Design tokens

Source of truth: `src/tokens/*.ts` in this repo, generated into `dist/css/tailwind.css`
(Tailwind 4, CSS-native — there is no `tailwind.config.js`; the theme is `@theme` /
`@theme inline` blocks). Consumers use shadcn `components.json` with style `new-york`,
lucide icons, `cssVariables: true`.

## Colors

Raw hex custom properties on `:root` (light) and `.dark` (dark) in
`app/globals.css`, re-exposed to Tailwind via `@theme inline`. Using the semantic
classes makes styles dark-mode-aware with **no `dark:` prefix**.

| Tailwind class | Light | Dark | Use |
|---|---|---|---|
| `bg-background` / `text-foreground` | `#ffffff` / `#0a0a0a` | `#0a0a0a` / `#e6e6e6` | page ground / text |
| `bg-card` (+`text-card-foreground`) | `#f8f8f8` | `#141414` | card surfaces |
| `bg-primary` / `text-primary-foreground` | `#0a0a0a` / white | `#e6e6e6` / near-black | primary buttons (near-monochrome by design) |
| `bg-secondary` | `#e2e8f0` | `#1a1a1a` | secondary surfaces |
| `bg-muted` / `text-muted-foreground` | `#f1f5f9` / `#64748b` | `#262626` / `#a1a1aa` | subdued surfaces / **chrome** text (see below) |
| `text-reading` | `#262626` | `#c8c8c8` | **running prose in an article** (see below) |
| `text-accent` / `bg-accent` | `#d97706` (amber) | `#fbbf24` | the accent; also `ring-ring` |
| `bg-destructive` | `#ef4444` | `#dc2626` | destructive actions/errors |
| `border-border` / `border-input` | `#e2e8f0` | `#262626` | borders, field borders |
| `bg-join` / `text-join-foreground` | `#7c3aed` / white | `#8b5cf6` / white | **reserved**: the header "Join Us" CTA only — the one saturated color |
| `bg-chart-1..5` | amber/green/purple/violet/red | lighter twins | charts |

`--radius` base = `0.625rem`. Custom shadow: `shadow-glow` (`0 0 8px 2px` in current shadow color).

### The three text roles

Every piece of text on the site is one of exactly three:

| Role | Token | Dark | Light | For |
|---|---|---|---|---|
| title | `text-foreground` | `#e6e6e6` (15.9:1) | `#0a0a0a` (19.8:1) | headings, emphasis, `strong` inside prose |
| reading | `text-reading` | `#c8c8c8` (11.8:1) | `#262626` (15.1:1) | running prose in an article, and its standfirst |
| chrome | `text-muted-foreground` | `#a1a1aa` (7.7:1) | `#64748b` (4.8:1) | meta, labels, timestamps, placeholders, icon tints, empty states |

Ratios are against `bg-background`; on `bg-card` each drops ~7%, and all three
still clear their bar. `text-muted-foreground` is 4.8:1 in light — AA, not AAA
— which is another reason body copy must not use it.

**Do not reach for `text-reading` in the interface.** It is applied
automatically to `.markdown-content` prose (see the article-scale note below), so blog posts, `/news` updates and event descriptions get
it without a class. Write it by hand only for text that reads like an article
but is not markdown — an article standfirst, a summary panel. A card blurb, a
section deck and a table cell are chrome: they stay `text-muted-foreground`.

**`text-muted-foreground` was NOT renamed to something reading-ish**, and the
reason is worth keeping: it has ~1830 call sites and only 7 of them sit on the
article step (`text-lead`), while 178 sit on `text-micro` badges/eyebrows and
~220 tint an icon. 46% of them are in `/admin`. It is the chrome token, and
reading content needed its own name rather than a rename of that one.

## Type scale (golden ratio, anchored at 14px)

Defined in a plain `@theme` block in `tailwind.css`. Neighboring steps are
√φ (1.272) apart; every other step is exactly φ. The top six steps are **fluid**
(`clamp()` interpolating 390→1440px viewport, rem-based so it respects user font
size). Each step carries its own line-height — never add `leading-*`.

| Class | Size | Line-height | Use for |
|---|---|---|---|
| `text-micro` | 11px | 1.45 | eyebrows, badges, tracked labels |
| `text-body` | 14px (anchor; the `body` default) | 1.618 | body copy and UI |
| `text-lead` | 18px | 1.5 | intros/standfirsts, large UI, article prose |
| `text-title` | 18→23px fluid | 1.35 | card headlines |
| `text-section` | 23→29px fluid | 1.272 | section headings (h2) |
| `text-page` | 29→37px fluid | 1.2 | feature headlines, article h1 |
| `text-display` | 37→47px fluid | 1.15 | inner-page h1 |
| `text-hero` | 47→59px fluid | 1.1 | top-level page h1 (PageHero default) |
| `text-mega` | 59→75px fluid | 1.05 | statement type (/about, /labs) |

Bans (a consumer can enforce them with a drift test like the one in aisocratic.org): `text-[Npx]`, stock steps
(`text-xs`…`text-9xl`), `text-X md:text-Y` heading chains, `font-mono`,
bold/semibold on the display face. 

**Article scale**: inside `.markdown-content` (blog posts, /news updates, event
descriptions via `components/markdown-content.tsx`), prose runs one step up:
`p/li` → `text-lead`, `h1` → `text-page`, `h2` → `text-section`, `h3` → `text-title`,
tables → `text-body`. "An article is read, not scanned."

## Fonts

Loaded by the app (`app/fonts.ts`, see adopting.md) into the three `--stoa-font-*` slots:

| Class | Face | Role |
|---|---|---|
| `font-body` | Space Grotesk (weight 400) | body/UI — the `body` default, usually redundant to write |
| `font-display` | Newsreader (weight 200 + italic, loaded by the app) | headings only; NEVER add a weight class |
| `font-code` | JetBrains Mono (400/500) | code, CLI-styled chrome |

There is no `font-mono`. In the codebase this was extracted from it mapped to the
body sans and was never monospace — say `font-body` or `font-code` and mean it.

## Radii (φ ladder)

`rounded-sm` 6px · `rounded-lg` 10px (base) · `rounded-xl` 16px · `rounded-2xl` 26px.
`rounded-md` is a deprecated alias of base; bare `rounded` (4px) is off-ladder — use
`rounded-sm`.

## Layout utilities

- `page-shell` (custom `@utility`): `w-full mx-auto px-4 max-w-[calc(72rem+2rem)]`,
  `md: px-6 max-w-[calc(72rem+3rem)]`. Gutter is added on top of the 72rem cap so it
  aligns exactly with a hand-written `px-4 md:px-6 > max-w-6xl mx-auto` pair.
- `container` is redefined: `mx-auto px-4`, `2rem` @768px, `3rem` @1280px.
- Safe-area utilities for PWA: `pt-safe` / `pb-safe` / `px-safe`.
- Breakpoints are stock Tailwind (`sm/md/lg/xl/2xl`) — no custom ones.

## Dark mode

- Class strategy via `next-themes`: `ThemeProvider attribute="class" defaultTheme="dark"
  enableSystem` in `app/layout.tsx`; `@custom-variant dark (&:is(.dark *));` in globals.
- Site defaults to **dark**.
- Token classes adapt automatically. Reach for a token first; use `dark:` only for
  one-off non-token colors (e.g. `text-purple-600 dark:text-purple-400`).
- Toggle component: `components/theme-toggle.tsx`.

## `cn()` and control variants

- `cn()` from `@aisocratic/stoa` = clsx + an **extended** tailwind-merge that registers the
  nine `text-*` scale steps as font-size classes. Without this, merging
  `"text-primary-foreground"` with `"text-body"` silently drops the color (caused a
  real white-on-white bug). `TYPE_SCALE` is derived from the token source, so a new step needs no second edit.
- `@aisocratic/stoa/control-variants` holds the shared cva building blocks for interactive
  controls: `controlBase`, `controlSize` (`default` h-8 / `sm` h-7 / `lg` h-10 /
  `icon` size-8), `controlColor` (default/secondary/outline/ghost/destructive), and
  `fieldVariants` (the canonical form-field surface incl. `aria-invalid` styling).
  Build new controls from these, not from scratch.
