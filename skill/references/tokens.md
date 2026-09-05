# Design tokens

Source of truth: `src/tokens/*.ts` in this repo, generated into `dist/css/tailwind.css`
(Tailwind 4, CSS-native — there is no `tailwind.config.js`; the theme is `@theme` /
`@theme inline` blocks). Consumers use shadcn `components.json` with style `new-york`,
lucide icons, `cssVariables: true`.

## Colours: a palette, then roles

The light palette uses the ivory, oat and warm ink colors measured on
[Anthropic](https://www.anthropic.com/) on 2026-09-04. Dark keeps aisocratic.org's ink theme.
Use semantic roles in components. Primitive values are only for theme overrides.

| Role                         | Light            | Dark                  |
| ---------------------------- | ---------------- | --------------------- |
| background                   | oat.2 `#f0eee6`  | ink.1 `#0a0a0a`       |
| foreground                   | oat.12 `#141413` | ink.12 `#e6e6e6`      |
| reading                      | oat.11 `#3d3d3a` | neutral.300 `#c8c8c8` |
| muted-foreground             | oat.10 `#5e5d59` | ink.11 `#a1a1aa`      |
| card                         | oat.1 `#faf9f5`  | ink.2 `#141414`       |
| popover                      | oat.1            | ink.1                 |
| muted                        | oat.3            | ink.4                 |
| secondary                    | oat.3            | ink.3                 |
| border / input               | oat.4            | ink.4                 |
| primary / primary-foreground | oat.12 / oat.1   | neutral.50 / ink.1    |
| accent / ring                | amber.600        | amber.400             |
| join                         | violet.600       | violet.500            |
| destructive                  | red.600          | red.600               |

The page uses ivory-medium and cards use ivory-light, so broad surfaces avoid
stark white. Warm muted text remains readable on cards, muted fills, and secondary
controls. Destructive fills use red.600 with white labels in both modes.

`foreground` names headings and emphasis, `reading` names article prose, and
`muted-foreground` names metadata, labels, and placeholders. Reading is an explicit
pair matching the website, so override it too when creating a different theme.

Seven `status-*` roles cover success, warning, caution, danger, info, highlight,
and accent. They use a deep hue in light mode and a light hue in dark mode.
Categorical charts reuse status hues. `chart-ramp-1` is amber; the remaining ramp
steps are oat in light mode and ink in dark mode. Charts always carry labels.

`card-foreground`, `popover-foreground`, and `secondary-foreground` alias
`foreground`; `input` aliases `border`, and `ring` aliases `accent`.

The 12-step `oat` scale drives light surfaces, text and neutral chart ramps.
Legacy cool neutral/slate primitives remain available for overrides. Resolved colors are
exported in `@aisocratic/design/tokens.json`, also displayed in the gallery.

## Type scale (golden ratio, anchored at 14px)

Defined in a plain `@theme` block in `tailwind.css`. Neighboring steps are
√φ (1.272) apart; every other step is exactly φ. The top six steps are **fluid**
(`clamp()` interpolating 390→1440px viewport, rem-based so it respects user font
size). Each step carries its own line-height — never add `leading-*`.

| Class          | Size                              | Line-height | Use for                                            |
| -------------- | --------------------------------- | ----------- | -------------------------------------------------- |
| `text-micro`   | 11px                              | 1.45        | eyebrows, badges, tracked labels                   |
| `text-body`    | 14px (anchor; the `body` default) | 1.618       | body copy and UI                                   |
| `text-lead`    | 18px                              | 1.5         | intros/standfirsts, large UI, article prose        |
| `text-title`   | 18→23px fluid                     | 1.35        | card headlines                                     |
| `text-section` | 23→29px fluid                     | 1.272       | section headings (h2)                              |
| `text-page`    | 29→37px fluid                     | 1.2         | feature headlines, article h1, admin record titles |
| `text-display` | 37→47px fluid                     | 1.15        | inner-page h1                                      |
| `text-hero`    | 47→59px fluid                     | 1.1         | top-level page h1 (PageHero default)               |
| `text-mega`    | 59→75px fluid                     | 1.05        | statement type                                     |

### Text styles

Two recipes the site used to spell out by hand, now one class each:

| Class          | Is                                                     | For                                                        |
| -------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `text-nav`     | `text-body` + uppercase + `tracking-nav` (0.08em)      | the header navigation on aisocratic.org — in the body face |
| `text-eyebrow` | `text-micro` + uppercase + `tracking-eyebrow` (0.14em) | eyebrows, footer column heads, status group labels         |

Bans (a consumer can enforce them with a drift test): `text-[Npx]`, stock steps
(`text-xs`…`text-9xl`), `text-X md:text-Y` heading chains, `font-mono`,
bold/semibold on the display face.

**Article scale**: inside `.markdown-content` (a consumer's prose wrapper), prose runs
one step up: `p/li` → `text-lead`, `h1` → `text-page`, `h2` → `text-section`,
`h3` → `text-title`, tables → `text-body`. "An article is read, not scanned."

## Fonts

Loaded by the app (`app/fonts.ts`, see adopting.md) into the three `--aisocratic-font-*` slots. Legacy `--stoa-font-*` values remain fallback-compatible.

| Class          | Face                             | Role                                                                                               |
| -------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `font-body`    | Space Grotesk (weight 400)       | body/UI and the header nav — the `body` default, usually redundant to write                        |
| `font-display` | Newsreader (weight 200 + italic) | headings only; NEVER add a weight class. aisocratic.org fills this slot with its own licensed face |
| `font-code`    | JetBrains Mono (400/500)         | code and technical values                                                                          |

There is no `font-mono`. Say `font-body` or `font-code` and mean it.

## Radii — two rungs

| Class          | Size | For                                                                |
| -------------- | ---- | ------------------------------------------------------------------ |
| `rounded-md`   | 10px | controls: buttons, inputs, badges, menu items, tabs, compact cards |
| `rounded-xl`   | 16px | surfaces: cards, dialogs, popovers, panels                         |
| `rounded-full` | —    | pills, avatars, the segmented control                              |

Every other Tailwind name lands on a rung: `rounded`, `-xs`, `-sm`, `-lg` → 10px;
`-2xl` → 16px; `-3xl` and up do not exist. `--radius` (shadcn's base) is 10px.

## Layout utilities

- `page-shell` (custom `@utility`): `w-full mx-auto px-4 max-w-[calc(72rem+2rem)]`,
  `md: px-6 max-w-[calc(72rem+3rem)]`. Gutter is added on top of the 72rem cap so it
  aligns exactly with a hand-written `px-4 md:px-6 > max-w-6xl mx-auto` pair.
- `container` is redefined: `mx-auto px-4`, `2rem` @768px, `3rem` @1280px.
- Safe-area utilities for PWA: `pt-safe` / `pb-safe` / `px-safe`.
- Breakpoints are stock Tailwind (`sm/md/lg/xl/2xl`) — no custom ones.

## Dark mode

- Class strategy via `next-themes`: `ThemeProvider attribute="class" defaultTheme="dark"
enableSystem`; `@custom-variant dark` keys on `.dark` or `[data-theme="dark"]`.
- Site defaults to **dark**.
- Token classes adapt automatically. Reach for a role first; `dark:` is for the
  rare one-off. `Section tone="dark"` is a themed band, not raw black.
- Toggle component: `@aisocratic/design/components/theme-toggle`.

## `cn()` and control variants

- `cn()` from `@aisocratic/design` = clsx + an **extended** tailwind-merge that registers the
  nine `text-*` scale steps and the two text styles as font-size classes. Without this,
  merging `"text-primary-foreground"` with `"text-body"` silently drops the color (caused a
  real white-on-white bug). `TYPE_SCALE` is derived from the token source.
- `@aisocratic/design/control-variants` holds the shared cva building blocks for interactive
  controls: `controlBase` (`rounded-md`, `text-body`, the focus ring), `controlSize`
  (`default` h-8 / `sm` h-7 / `lg` h-10 / `icon` size-8), `controlColor`
  (default/secondary/outline/ghost/destructive), and `fieldVariants` (the canonical
  form-field surface incl. `aria-invalid` styling). Build new controls from these.
