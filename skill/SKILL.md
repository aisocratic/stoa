---
name: stoa
description: The AI Socratic design system (Stoa) — layout skeleton, golden-ratio type scale, color tokens, and the reusable component/form library. Use WHENEVER creating or editing a webpage, component, form, dialog, card, hero, section, or any UI in this repo (public site or admin), so new UI reuses the existing system instead of inventing new styles or components. Triggers: "new page", "add a section", "build a form", "create a component", "style this", landing pages, admin pages, CTAs, cards, tables.
---

# stoa

The AI Socratic design system, shipped as `@aisocratic/stoa`. It is what aisocratic.org,
Agora and Atlas are built on. **Reuse before you create**: search
`@aisocratic/stoa` and the app's own `components/ui/` before writing any new component,
and use the exact class recipes here instead of improvising Tailwind.

Reference files in `references/` (read the one matching your task):

| File | Read when… |
|---|---|
| `references/tokens.md` | choosing any color, font, text size, radius, spacing, or dark-mode style |
| `references/layouts.md` | building/editing a page: skeleton, hero, sections, grids, SEO metadata, header/mobile-menu chrome geometry |
| `references/components.md` | picking a component: buttons, cards, badges, dialogs, empty states, etc. |

An app may carry its own skill for product-specific chrome (an admin dashboard, a
board); this skill is the layer underneath it and wins on tokens, type and radii.

## Golden rules (always apply)

1. **Type scale only.** Nine steps: `text-micro` `text-body` `text-lead` `text-title`
   `text-section` `text-page` `text-display` `text-hero` `text-mega`. Never use stock
   Tailwind sizes (`text-sm`, `text-xl`, …), never `text-[Npx]`, never `text-X md:text-Y`
   responsive chains for headings (the upper six steps are fluid `clamp()` already), and
   never pair a step with `leading-*` (each step owns its line-height).
   Enforce it with a drift test in the consuming repo.
2. **Fonts:** `font-display` (Newsreader) for headings, `font-body` (Space Grotesk, the
   default) for everything else, `font-code` (JetBrains Mono) for code/CLI chrome.
   **Never put `font-bold`/`font-semibold` on `font-display`** — Newsreader loads only weight 200; hierarchy comes from size. `font-mono` and `font-newsreader` are
   deprecated aliases — do not use in new code.
3. **Semantic color tokens only** — `bg-background`, `text-foreground`,
   `text-muted-foreground`, `bg-card`, `border-border`, `bg-primary`,
   `text-accent`, `bg-destructive`, etc. They are dark-mode-aware automatically
   (no `dark:` prefix needed). Only use `dark:` for one-off non-token colors, and
   avoid raw palette colors (`bg-slate-100`, inline hex) entirely.
   **Text is one of three roles**: `text-foreground` (titles, emphasis),
   `text-reading` (prose in an article — applied to `.markdown-content`
   automatically), `text-muted-foreground` (chrome: meta, labels, icons,
   placeholders). Never hand-roll a shade with `text-foreground/80` — that is
   what `text-reading` is. See `references/tokens.md`.
4. **Page width = `page-shell`** (the custom utility ≈ `max-w-6xl mx-auto px-4 md:px-6`).
   **Page skeleton = `Section` / `SectionHeading` / `RuledHeading` / `PageHero`** from
   `@aisocratic/stoa` (`Section`). First section of a page gets `lead` (clears the fixed
   104px header). Do not hand-roll `<section className="py-20 …">` bands or `pt-32` mains
   — that is the legacy pattern these components were built to retire.
5. **Radius ladder:** `rounded-sm` (6) · `rounded-lg` (10, base) · `rounded-xl` (16) ·
   `rounded-2xl` (26). Avoid bare `rounded` and `rounded-md`.
6. **Buttons:** `Button` (`@aisocratic/stoa` (`Button`)) for actions — use its `loading`
   prop, not hand-rolled spinners. For navigation styled as a button, `<Button asChild><Link/></Button>`
   (apps usually wrap this as `ButtonLink`). Never hand-roll button markup.
7. **Form fields:** build on `Input`/`Textarea`/`Label` through the app's one labelled
   field component (aisocratic.org calls it `TextField`). Fields carry their own
   label/description/error chrome. Never compose raw `Label`+`Input`+error text inline.
8. **Toasts** via `sonner` (`Toaster` from `@aisocratic/stoa/components/sonner`).
9. **`cn()` from `lib/utils.ts`** for all class merging — it's configured to understand
   the custom type scale (plain `twMerge` would drop text colors when merged with
   `text-body` etc.).
10. **Cards:** `Card`/`cardSurface` from `@aisocratic/stoa` (`Card`) for boxed surfaces;
    editorial feeds use the open (border-less) `StoryTile` pattern. Icons: `lucide-react`
    only.

## Reuse order

`@aisocratic/stoa` primitive → `@aisocratic/stoa` composed pattern (`SectionHeading`,
`EmptyState`, …) → the app's own `components/ui/*` → only then write a new component. If you do create one, make it general, put it in
the right layer, and follow these rules so it joins the system.
