# AI Socratic Design

**The AI Socratic design system, as one package.** Tokens, a Tailwind v4
theme, and the React primitives behind [aisocratic.org](https://aisocratic.org)
and its sibling apps — so every product reads as one family, and updating the
design is a version bump.

**[View the component gallery →](https://aisocratic.github.io/stoa/)**

The package name is `@aisocratic/design`; this revision is available from the
repository and is not yet published to npm. Build a portable archive locally:

```bash
git clone https://github.com/aisocratic/stoa.git
cd stoa
pnpm install --frozen-lockfile
pnpm build
pnpm pack --pack-destination /tmp
# In a consumer: pnpm add /tmp/aisocratic-design-0.2.0.tgz
```

For reproducible installs, keep the archive in the consumer's `vendor/` directory
and install that relative path. See [adopting](docs/adopting.md).

```css
/* app/globals.css — the whole file */
@import "tailwindcss";
@import "@aisocratic/design/tailwind.css";
```

```tsx
import { Section, PageHero, Button, cn } from "@aisocratic/design"
import { Dialog } from "@aisocratic/design/components/dialog"
```

> **Status: 0.2.** Extracted from a codebase where it has run in daily use.
> The API is small and the values are settled; expect additive change.

## What is in it

| Import                                                 | For                                               | Contents                                                                                                                                                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@aisocratic/design/tailwind.css`                      | Next.js / Tailwind v4 apps                        | colour tokens in light and dark, the type scale, radii, font roles, `page-shell`, base layer, the `dark` variant                                                                                                                  |
| `@aisocratic/design/tokens.css`                        | static sites, Remotion, anything without Tailwind | the same custom properties, plain CSS                                                                                                                                                                                             |
| `@aisocratic/design`                                   | React apps                                        | `cn`, control variants, `Section` / `SectionHeading` / `RuledHeading` / `PageHero`, Button, Badge, Card, Input, Textarea, Table, Alert, Skeleton, Spinner, EmptyState, Collapsible, `LogoMark`, `Wordmark`, and the token objects |
| `@aisocratic/design/components/<name>`                 | React apps                                        | everything with an optional peer: Dialog, Sheet, Select, Popover, Tooltip, Tabs, DropdownMenu, ScrollArea, Progress, Avatar, Checkbox, Switch, Label, Command, Sonner                                                             |
| `@aisocratic/design/tokens` · `tokens.json` · `native` | scripts, React Native, design tools               | the typed source, its JSON, and an RN-shaped `{ colors, radii, type, fonts }`                                                                                                                                                     |

## The system in six rules

1. **Nine sizes, one scale.** `text-micro` `text-body` `text-lead` `text-title`
   `text-section` `text-page` `text-display` `text-hero` `text-mega` — a
   golden-ratio ladder anchored at 14px, the top six fluid. Never a stock
   `text-sm`, never `text-[Npx]`, never `leading-*` beside a step. Two text
   styles on top: `text-nav` (the header navigation) and `text-eyebrow`.
2. **A palette, then roles.** Every hex lives once in the palette (white/slate light surfaces, a 12-step _ink_ dark neutral,
   Tailwind-weight hues); only the semantic roles become classes, and each points at a
   palette entry per mode. The optional oat palette supports warm theme overrides.
3. **Three text colours.** `text-foreground` for titles and emphasis,
   `text-reading` for prose in an article, `text-muted-foreground` for chrome.
   No fourth shade.
4. **Three faces, by role.** `font-body` (Space Grotesk — body, UI and the
   header nav), `font-display` (Newsreader 200 — hierarchy comes from size,
   never a weight class), `font-code` (JetBrains Mono). The app loads them;
   the package ships none.
5. **Two radii.** `rounded-md` 10px for controls, `rounded-xl` 16px for
   surfaces, `rounded-full` for pills. Every other name aliases to one of
   them. Cards are `border`, not shadow.
6. **One measure.** `page-shell` is 72rem plus a gutter added on top, so every
   page's content box lines up.

The reasoning behind each value is in the token files themselves
(`src/tokens/*.ts`) and in [`docs/`](docs/).

## Adopting it

- **Next.js**: [`docs/adopting.md`](docs/adopting.md) — the two-line
  `globals.css`, an `app/fonts.ts` that fills the three font slots with
  `next/font/google`, and the `lib/utils.ts` shim that keeps `npx shadcn add`
  working.
- **GitHub Pages**: link `site.css` for shared page chrome and tokens; see [adopting](docs/adopting.md#github-pages-project-sites).
- **Static tokens only**: link `tokens.css` before your stylesheet; theme follows
  the OS, or force it with `<html data-theme="dark">`.
- **React Native**: `import { native } from "@aisocratic/design/native"`.
- **Overriding a token**: write it unlayered after the import. Package tokens
  live in `@layer base`, so yours always win. See
  [`docs/theming.md`](docs/theming.md).

## For coding agents

`skill/` is a Claude Code skill that teaches the system's rules and recipes.
Copy it into a consumer repo's `.claude/skills/ai-socratic-design/` so agents reuse the
system instead of inventing styles.

## Development

```bash
pnpm install
pnpm verify      # typecheck + build + tests
pnpm site:dev    # the gallery
```

## Migrating from Stoa

Replace `@aisocratic/stoa` imports with `@aisocratic/design`. Font slots now use
`--aisocratic-font-body`, `--aisocratic-font-display`, and
`--aisocratic-font-code`; the former `--stoa-font-*` variables remain supported
as fallbacks during the compatibility window.

## License

MIT © AI Socratic. Space Grotesk, Newsreader and JetBrains Mono are under
the SIL Open Font License 1.1 and are loaded by the consuming application;
this repository contains no font files.
