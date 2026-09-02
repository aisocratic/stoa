# Adopting Stoa

## Next.js 15/16 with Tailwind v4

1. `pnpm add @aisocratic/stoa`. Peers you already have (`react`, `lucide-react`,
   `@radix-ui/react-slot`); add the Radix packages, `next-themes`, `sonner`
   or `cmdk` only for the components you import.

2. `app/globals.css` becomes:

   ```css
   @import "tailwindcss";
   @import "@aisocratic/stoa/tailwind.css";
   ```

   Delete your `@import "tw-animate-css"`, `@custom-variant dark`, token
   blocks, `@theme` blocks and base layer — they are all in the import. Keep
   anything app-specific below it, unlayered.

3. `app/fonts.ts` — `next/font` must be called in app source, so this file
   stays in your repo:

   ```ts
   import { JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google"

   export const body = Space_Grotesk({ weight: "400", subsets: ["latin"], display: "swap", variable: "--stoa-font-body" })
   export const display = Newsreader({ weight: ["200"], style: ["normal", "italic"], subsets: ["latin"], display: "swap", variable: "--stoa-font-display" })
   export const code = JetBrains_Mono({ weight: ["400", "500"], subsets: ["latin"], display: "swap", variable: "--stoa-font-code" })

   export const fontClassName = `${body.variable} ${display.variable} ${code.variable}`
   ```

   Put `fontClassName` on `<html>` (or `<body>`). The slots inherit.

4. `lib/utils.ts` becomes a shim so every existing import and `npx shadcn add`
   keep working:

   ```ts
   export { cn } from "@aisocratic/stoa"
   ```

5. Theme provider as before: `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>`.

6. `next.config`: add `"@aisocratic/stoa"` to `experimental.optimizePackageImports`.

7. Replace local copies of the packaged primitives with re-exports, or import
   from the package directly:

   ```ts
   // components/ui/button.tsx — zero call sites change
   export * from "@aisocratic/stoa/components/button"
   ```

App-local shadcn components keep working unchanged: they import `cn` from
`@/lib/utils`, which now resolves to the package's.

## Static site (no build)

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&family=Newsreader:ital,opsz,wght@0,6..72,200;1,6..72,200&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="./vendor/stoa.css">   <!-- a pinned copy of dist/css/tokens.css -->
<link rel="stylesheet" href="./styles.css">
```

Then write `font-family: var(--font-display)`, `font-size: var(--text-hero)`,
`line-height: var(--text-hero--line-height)`, `color: var(--foreground)`,
`border-radius: var(--radius-xl)`. Copy `dist/css/tokens.css` into your repo
(from `https://cdn.jsdelivr.net/npm/@aisocratic/stoa@<version>/dist/css/tokens.css`)
and note the version; that copy is your dependency.

## React Native / Expo

```ts
import { native } from "@aisocratic/stoa/native"

native.colors.dark.background   // "#0a0a0a"
native.type.body                // { fontSize: 14, lineHeight: 23 }
native.radii.xl                 // 16
native.fonts.display            // "Newsreader" — load it with expo-font
```

If your Jest config does not transform ESM in `node_modules`, add
`@aisocratic/stoa` to its `transformIgnorePatterns` exception.

## Remotion

`@import "@aisocratic/stoa/tailwind.css"` in the root stylesheet, put
`className="dark"` on a dark composition root, and take font names from
`@aisocratic/stoa/tokens` (`fonts.body.family`).
