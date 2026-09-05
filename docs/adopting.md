# Adopting AI Socratic Design

## Next.js 15/16 with Tailwind v4

1. Build Stoa and run `pnpm pack --pack-destination /tmp`, copy the archive into
   your repo's `vendor/`, then `pnpm add ./vendor/aisocratic-design-0.2.0.tgz`.
   This revision is not yet published to npm. After publication, use
   `pnpm add @aisocratic/design`. Peers you already have (`react`, `lucide-react`,
   `@radix-ui/react-slot`); add the Radix packages, `next-themes`, `sonner`
   or `cmdk` only for the components you import.

2. `app/globals.css` becomes:

   ```css
   @import "tailwindcss";
   @import "@aisocratic/design/tailwind.css";
   ```

   Delete your `@import "tw-animate-css"`, `@custom-variant dark`, token
   blocks, `@theme` blocks and base layer — they are all in the import. Keep
   anything app-specific below it, unlayered.

3. `app/fonts.ts` — `next/font` must be called in app source, so this file
   stays in your repo:

   ```ts
   import { JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google"

   export const body = Space_Grotesk({ weight: "400", subsets: ["latin"], display: "swap", variable: "--aisocratic-font-body" })
   export const display = Newsreader({
     weight: ["200"],
     style: ["normal", "italic"],
     subsets: ["latin"],
     display: "swap",
     variable: "--aisocratic-font-display",
   })
   export const code = JetBrains_Mono({ weight: ["400", "500"], subsets: ["latin"], display: "swap", variable: "--aisocratic-font-code" })

   export const fontClassName = `${body.variable} ${display.variable} ${code.variable}`
   ```

   Put `fontClassName` on `<html>`. The font roles resolve at the root, so
   placing the loader variables only on `<body>` can leave them using fallback
   faces instead of the loaded fonts.

4. `lib/utils.ts` becomes a shim so every existing import and `npx shadcn add`
   keep working:

   ```ts
   export { cn } from "@aisocratic/design"
   ```

5. Theme provider as before: `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>`.

6. `next.config`: add `"@aisocratic/design"` to `experimental.optimizePackageImports`.

7. Replace local copies of the packaged primitives with re-exports, or import
   from the package directly:

   ```ts
   // components/ui/button.tsx — zero call sites change
   export * from "@aisocratic/design/components/button"
   ```

App-local shadcn components keep working unchanged: they import `cn` from
`@/lib/utils`, which now resolves to the package's.

## Static site (no build)

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&family=Newsreader:ital,opsz,wght@0,6..72,200;1,6..72,200&family=JetBrains+Mono:wght@400;500&display=swap"
/>
<link rel="stylesheet" href="./vendor/ai-socratic-design.css" />
<!-- a pinned copy of dist/css/tokens.css -->
<link rel="stylesheet" href="./styles.css" />
```

Then write `font-family: var(--font-display)`, `font-size: var(--text-hero)`,
`line-height: var(--text-hero--line-height)`, `color: var(--foreground)`,
`border-radius: var(--radius-xl)`, `color: var(--reading)`, `background: var(--card)`. Copy `dist/css/tokens.css` into your repo
from a local `pnpm build` and note the version and content hash; that copy is
your dependency. Once published, a versioned npm CDN URL can supply the same file.

## React Native / Expo

```ts
import { native } from "@aisocratic/design/native"

native.colors.light.background // "#f0eee6" — warm ivory
native.colors.dark.background // "#0a0a0a"
native.type.body // { fontSize: 14, lineHeight: 23 }
native.textStyles.nav // { fontSize: 14, textTransform: "uppercase", letterSpacing: 1.12, … }
native.radii.md // 10 — controls
native.radii.xl // 16 — surfaces
native.fonts.display // "Newsreader" — load it with expo-font
```

If your Jest config does not transform ESM in `node_modules`, add
`@aisocratic/design` to its `transformIgnorePatterns` exception.

## Remotion

`@import "@aisocratic/design/tailwind.css"` in the root stylesheet, put
`className="dark"` on a dark composition root, and take font names from
`@aisocratic/design/tokens` (`fonts.body.family`).

## GitHub Pages project sites

Stoa, Agora and Atlas share a public site structure: AI Socratic lockup and product
name, tracked navigation, theme toggle and GitHub action, centered PageHero,
ruled sections, bordered previews/cards, and footer links to all three projects.
Use the same 72rem content width, 104px header clearance, and font roles.

Static sites import `@aisocratic/design/site.css` (or vendor `dist/css/site.css`).
It includes tokens plus shared `.page-shell`, `.site-header`, `.site-bar`, `.brand`,
`.lockup`, `.product`, `.site-nav`, `.nav-link`, `.site-actions`, `.site-menu`,
`.theme-toggle`, `.mobile-menu`, `.section`, `.section-head`, `.btn`, `.btn-primary`,
`.btn-outline`, `.project-hero`, `.project-links`, and footer recipes. Keep only
product previews and content layout in the consuming site's stylesheet. The
static import supplies appearance; theme/menu behavior stays in the consumer.

For unpublished local development, run `pnpm build` in Stoa, then import the built
package with `pnpm add @aisocratic/design@file:../stoa` in a React consumer, or
copy the generated stylesheet into the static site's vendor directory. Record
the package version and SHA-256 of the vendored CSS, and provide a refresh script
that supports a local checkout. A clean clone must work without sibling repos.
Never use an absolute developer path as a production dependency.

The website's existing display font can fill `--aisocratic-font-display` through
its own font loader. Newsreader 200 is the portable default; Stoa ships no fonts.
