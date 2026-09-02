# Stoa

**The AI Socratic design system, as one package.** Tokens, a Tailwind v4
theme, and the React primitives behind [aisocratic.org](https://aisocratic.org)
and its sibling apps — so every product reads as one family, and updating the
design is a version bump.

```bash
pnpm add @aisocratic/stoa
```

```css
/* app/globals.css — the whole file */
@import "tailwindcss";
@import "@aisocratic/stoa/tailwind.css";
```

```tsx
import { Section, PageHero, Button, cn } from "@aisocratic/stoa"
import { Dialog } from "@aisocratic/stoa/components/dialog"
```

> **Status: 0.1.** Extracted from a codebase where it has run in daily use.
> The API is small and the values are settled; expect additive change.

## What is in it

| Import | For | Contents |
|---|---|---|
| `@aisocratic/stoa/tailwind.css` | Next.js / Tailwind v4 apps | colour tokens in light and dark, the type scale, radii, font roles, `page-shell`, base layer, the `dark` variant |
| `@aisocratic/stoa/tokens.css` | static sites, Remotion, anything without Tailwind | the same custom properties, plain CSS |
| `@aisocratic/stoa` | React apps | `cn`, control variants, `Section` / `SectionHeading` / `RuledHeading` / `PageHero`, Button, Badge, Card, Input, Textarea, Table, Alert, Skeleton, Spinner, EmptyState, Collapsible, `LogoMark`, `Wordmark`, and the token objects |
| `@aisocratic/stoa/components/<name>` | React apps | everything with an optional peer: Dialog, Sheet, Select, Popover, Tooltip, Tabs, DropdownMenu, ScrollArea, Progress, Avatar, Checkbox, Switch, Label, Command, Sonner |
| `@aisocratic/stoa/tokens` · `tokens.json` · `native` | scripts, React Native, design tools | the typed source, its JSON, and an RN-shaped `{ colors, radii, type, fonts }` |

## The system in five rules

1. **Nine sizes, one scale.** `text-micro` `text-body` `text-lead` `text-title`
   `text-section` `text-page` `text-display` `text-hero` `text-mega` — a
   golden-ratio ladder anchored at 14px, the top six fluid. Never a stock
   `text-sm`, never `text-[Npx]`, never `leading-*` beside a step.
2. **Three text colours.** `text-foreground` for titles and emphasis,
   `text-reading` for prose in an article, `text-muted-foreground` for chrome.
   No fourth shade.
3. **Three faces, by role.** `font-body` (Space Grotesk), `font-display`
   (Newsreader 200 — hierarchy comes from size, never a weight class),
   `font-code` (JetBrains Mono). The app loads them; the package ships none.
4. **Four radii.** `rounded-sm` 6 · `rounded-lg` 10 · `rounded-xl` 16 ·
   `rounded-2xl` 26. Cards are `border`, not shadow.
5. **One measure.** `page-shell` is 72rem plus a gutter added on top, so every
   page's content box lines up.

The reasoning behind each value is in the token files themselves
(`src/tokens/*.ts`) and in [`docs/`](docs/).

## Adopting it

- **Next.js**: [`docs/adopting.md`](docs/adopting.md) — the two-line
  `globals.css`, an `app/fonts.ts` that fills the three font slots with
  `next/font/google`, and the `lib/utils.ts` shim that keeps `npx shadcn add`
  working.
- **Static site**: link `tokens.css` before your stylesheet; theme follows
  the OS, or force it with `<html data-theme="dark">`.
- **React Native**: `import { native } from "@aisocratic/stoa/native"`.
- **Overriding a token**: write it unlayered after the import. Package tokens
  live in `@layer base`, so yours always win. See
  [`docs/theming.md`](docs/theming.md).

## For coding agents

`skill/` is a Claude Code skill that teaches the system's rules and recipes.
Copy it into a consumer repo's `.claude/skills/stoa/` so agents reuse the
system instead of inventing styles.

## Development

```bash
pnpm install
pnpm verify      # typecheck + build + tests
pnpm site:dev    # the gallery
```

## License

MIT © AI Socratic. Space Grotesk, Newsreader and JetBrains Mono are under
the SIL Open Font License 1.1 and are loaded by the consuming application;
this repository contains no font files.
