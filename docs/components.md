# Components

Everything below is exported by `@aisocratic/stoa`. Reuse order in a consumer:
package primitive → package composed pattern → the app's own `components/ui/*`
(shadcn CLI output, which imports `cn` from the package) → a new component.

## From the barrel — `import { … } from "@aisocratic/stoa"`

| Export | Use for |
|---|---|
| `Section`, `SectionHeading`, `RuledHeading`, `PageHero` | the page skeleton — see [layouts.md](layouts.md) |
| `Button`, `buttonVariants` | any in-page action. `variant`: `default` · `cta` (bold + shadow) · `highlight` (pill) · `secondary` · `outline` · `ghost` · `destructive` · `link`. `size`: `default` (h-8) · `sm` · `xs` · `lg` (h-10) · `icon` · `icon-xs` · `icon-lg`. `asChild` for a link. **`loading` renders the Spinner and disables** — never hand-roll `disabled` + a spinning icon |
| `Badge`, `statusBadgeToneClasses` | two modes: themed `variant` (`default/secondary/destructive/outline`), or status `tone` (`success/warning/caution/danger/info/highlight/accent/neutral`, plus `size`, `shape`, `interactive`). Passing `tone` selects status mode. Tones are the `--status-*` tokens |
| `Card`, `cardSurface` | the one boxed surface: `bg-card border border-border rounded-xl`. Pad via `className`. `cardSurface` is the class string for elements that can't be a `<div>` |
| `Input`, `Textarea` | field surfaces built on `fieldVariants`; compose them inside your own labelled field component |
| `Table` family | plain table chrome |
| `Alert`, `AlertTitle`, `AlertDescription` | inline banner; `variant`: `default/destructive/success` |
| `Skeleton`, `SkeletonTable` | loading placeholders, `animate-skeleton-pulse` |
| `Spinner` | sizes `xs`–`2xl`; inside a Button use `loading` instead |
| `EmptyState` | "nothing here"; `variant="plain"|"panel"`, `icon`, `title`, `action` |
| `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` | disclosure, no Radix dependency |
| `LogoMark`, `Wordmark` | the brand — see [brand.md](brand.md) |
| `cn`, `TYPE_SCALE` | class merging that understands the type scale |
| `controlBase`, `controlSize`, `controlColor`, `fieldVariants` | the cva building blocks every control composes — build new controls from these |
| `tokens`, `colors`, `type`, `radii`, `fonts`, `shell`, `brand` | the typed token source |

## By subpath — `import { … } from "@aisocratic/stoa/components/<name>"`

These need an optional peer (a Radix package, `cmdk`, `sonner`, `next-themes`)
and are deliberately kept out of the barrel.

| Subpath | Family | Peer |
|---|---|---|
| `dialog` | Dialog, DialogContent (`showCloseButton`), DialogHeader/Title/Description/Footer | `@radix-ui/react-dialog` |
| `sheet` | side panel, `side` prop | `@radix-ui/react-dialog` |
| `select` | Select, SelectTrigger, SelectContent, SelectItem, … | `@radix-ui/react-select` |
| `popover` | Popover, PopoverTrigger, PopoverContent | `@radix-ui/react-popover` |
| `tooltip` | TooltipProvider (`delayDuration={0}` default), Tooltip, TooltipTrigger, TooltipContent | `@radix-ui/react-tooltip` |
| `tabs` | in-content panels only — route navigation is not a Tabs job | `@radix-ui/react-tabs` |
| `dropdown-menu` | menus | `@radix-ui/react-dropdown-menu` |
| `scroll-area` | styled scroll container | `@radix-ui/react-scroll-area` |
| `progress` | Progress | `@radix-ui/react-progress` |
| `avatar` | Avatar, AvatarImage, AvatarFallback | `@radix-ui/react-avatar` |
| `checkbox`, `switch`, `label` | form controls | the matching Radix package |
| `command` | command palette / combobox | `cmdk` |
| `sonner` | `Toaster`, theme-aware; call `toast()` from `sonner` | `sonner`, `next-themes` |

## Control geometry

`controlBase` = `text-body font-medium rounded-lg transition-all duration-200
ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring
disabled:…`. `controlSize.default` is **h-8**, the canonical rung; `sm` h-7,
`lg` h-10, `icon` size-8. `controlColor` has `default / secondary / outline /
ghost / destructive`. `fieldVariants` is the input surface (`bg-input
border-input`, focus ring, `aria-invalid` styling).

## What is not here, on purpose

Anything that imports a router or an image loader (`ButtonLink`,
pagination, row actions, avatars with `next/image`), charts, calendars, and
composed form fields. Those belong in the app, built on the primitives
above. Admin data tables and dashboard card frames are product code, not
design system.
