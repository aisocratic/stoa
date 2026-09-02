# Theming

## How dark mode is decided

One stylesheet serves three kinds of consumer:

| Consumer | Mechanism | What decides |
|---|---|---|
| Next.js with `next-themes` | `.light` / `.dark` class on `<html>` | the user's toggle, or the OS via `enableSystem` |
| Static site, no JS | `@media (prefers-color-scheme: dark)` | the OS |
| Anything forced | `data-theme="light"` / `"dark"` on any ancestor | you |

The generated block is:

```css
:root, .light, [data-theme="light"]                        { color-scheme: light; …light tokens }
.dark, [data-theme="dark"]                                 { color-scheme: dark;  …dark tokens }
@media (prefers-color-scheme: dark) {
  :root:not(.light):not([data-theme="light"])              { color-scheme: dark;  …dark tokens }
}
```

`next-themes` always writes a class before first paint, so the media branch
never fights it. A static page with no class follows the OS; add
`data-theme="dark"` to `<html>` to pin it.

`dark:` utilities key on the class or the attribute
(`@custom-variant dark (&:is(.dark *, [data-theme="dark"] *))`). A Tailwind
consumer that relies on the OS branch alone gets dark *tokens* but no `dark:`
utilities — so give Tailwind apps a theme class.

Side-by-side rendering is free: wrap any subtree in `<div class="dark">` (or
`class="light"`) and every token inside flips.

## Overriding a token

Package tokens live in `@layer base`. Anything you write **unlayered, after
the import** beats them, in every mode:

```css
@import "tailwindcss";
@import "@aisocratic/stoa/tailwind.css";

:root { --accent: #2563eb; --ring: #2563eb; }
.dark, [data-theme="dark"] { --accent: #60a5fa; --ring: #60a5fa; }
```

Because the Tailwind utilities point at the variable (`--color-accent:
var(--accent)`), every `bg-accent`, `text-accent` and `ring-ring` follows.

## Adding a token

```css
:root { --ok: #15803d; }
.dark, [data-theme="dark"] { --ok: #4ade80; }
@media (prefers-color-scheme: dark) { :root:not(.light):not([data-theme="light"]) { --ok: #4ade80; } }

@theme inline { --color-ok: var(--ok); }
```

Multiple `@theme` blocks merge, so this adds `bg-ok` / `text-ok` without
touching the package. Before adding a status colour, check the seven
`--status-*` tokens — that family probably already has what you need.

## Fonts are slots

The package never defines `--stoa-font-body`, `--stoa-font-display` or
`--stoa-font-code`; it only reads them with a fallback:

```css
--font-display: var(--stoa-font-display, "Newsreader", Georgia, "Times New Roman", serif);
```

A Next.js app fills the slot with `next/font`'s `variable`; a static site with
a Google Fonts `<link>` (the family is then found by name through the
fallback); a CSS-only consumer with `:root { --stoa-font-display: "Some Face", serif }`.

## Replacing a whole utility

`page-shell` and `container` are `@utility` blocks. To change one, redeclare
it after the import with the same name — the later declaration wins.
