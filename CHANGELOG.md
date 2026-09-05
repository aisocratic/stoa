# Changelog

All notable changes to `@aisocratic/design`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow semver.

## Unreleased

- Use Anthropic’s measured ivory/oat light palette across page surfaces, cards,
  controls and text. Dark mode retains the AI Socratic ink theme.

- Align light surfaces and reading colors with aisocratic.org; preserve readable
  small labels and offer oat primitives for optional warm themes.
- Use the body font consistently in shared public navigation, admin navigation,
  table chrome and auth controls.
- Export `site.css`: tokens and shared static header, hero, controls, mobile menu,
  sections and footer for the Stoa, Agora and Atlas GitHub Pages sites.
- Document local package adoption, vendored stylesheet updates and family links.

## Unreleased

- Use Anthropic’s measured ivory/oat light palette across page surfaces, cards,
  controls and text. Dark mode retains the AI Socratic ink theme.

### Changed

- Renamed the package and gallery to **AI Socratic Design** (`@aisocratic/design`).
  The `--stoa-font-*` custom properties remain as compatibility fallbacks.
- `DataTable` server mode now supports controlled sorting and synchronized
  search state; sortable headers and row URLs use native interactive elements.
- Multi-select, admin-drawer, authentication, and confirmation flows have
  stronger keyboard and asynchronous-state behavior.

### Added

- Component-level DOM and accessibility tests, JSX accessibility linting,
  formatting checks, wildcard-export verification, and a distribution-size budget.

## [0.2.0] — 2026-09-02

The design catches up with aisocratic.org and its admin, and the colour
system gets a standard shape.

### Changed

- **Colours are two layers.** A primitive palette (`src/tokens/palette.ts`)
  names every hex exactly once — a 12-step _oat_ light neutral, a 12-step
  _ink_ dark neutral (Radix step numbering), and Tailwind-weight hue pairs —
  and the semantic roles reference palette entries per mode. Only roles
  become classes. Roles drop from 48 to 35 plus 5 `var()` aliases for shadcn
  output (`card-foreground`, `popover-foreground`, `secondary-foreground`,
  `input`, `ring`). The `sidebar-*` family is gone (unused).
- **Light is oat, not white.** `--background` is `#f7f2e8`, cards `#f0ebdf`,
  text a warm near-black. Light `--muted-foreground` now clears 4.5:1 on a
  card (was 4.48).
- `--reading` is derived: `color-mix(in oklab, foreground 88%, background)`,
  redeclared per theme block so nested panels resolve it.
- Status hues deepen one weight on oat where needed (`warning` yellow-800,
  `danger` red-700, `success` green-800); charts reuse the status hues and
  the breakdown ramp is the neutral scale (steps 12 · 10 · 8 · 6, muted 3).
- **Two radii.** `rounded-md` 10px for controls, `rounded-xl` 16px for
  surfaces. `rounded`, `-xs`, `-sm`, `-lg` alias to 10px; `-2xl` to 16px;
  `-3xl` and up no longer exist. `radii` exports `{ md, xl }` and
  `radiusAliases`.
- Components use scale steps only (`text-body`, `text-micro`) — no stock
  `text-sm` / `text-xs` remain. Dialog titles are the display face.
- `Section tone="dark"` is now a themed band (`dark bg-background
text-foreground`) rather than raw black/white.
- `Alert` success/warning use the status tokens.
- `pnpm verify` runs build before typecheck (the generator reads the
  compiled tokens).

### Fixed

- `Wordmark` and `LogoMark` gradient ids come from `useId()`, so server and
  client render the same markup (the module counter drifted and warned on
  hydration).

### Added

- Text styles `text-nav` (body, uppercase, 0.08em — the aisocratic.org
  header navigation) and `text-eyebrow` (micro, uppercase, 0.14em), plus
  `tracking-nav` / `tracking-eyebrow`; `textStyles` in the token source and
  `native.textStyles`.
- Site chrome from aisocratic.org: `SiteHeader` (+ `navLinkClass`),
  `SiteFooter`, `components/theme-toggle`, `components/mobile-menu`.
- Admin chrome from aisocratic.org/admin: `AdminShell`, `PageHeader`,
  `PageToolbar`, `StickyBar` (+ `stickyRailClass`), `Breadcrumbs`,
  `SegmentedControl`, `MetricCard`.
- `palette`, `paletteHex`, `resolveColor`, `roleContrast`, `colorCss`,
  `contrast`, `mixOklab` in `@aisocratic/design/tokens`; `tokens.json` carries
  `palette`, `color.roles`, `color.aliases` and resolved hex per mode.
- Tables: `DataTable` (both admin archetypes, in-memory or `server`), `TableShell`
  and the table chrome classes, `SortableHeaderCell` / `useTableSort`,
  `PaginationControls`, `ResultsSummary`, `RowActions`, `FilterChip`,
  `FilterToolbar`, `FilterRail`.
- Forms: `TextField`, `SelectField`, `ToggleField`, `SearchField`,
  `FieldWrapper` / `useFieldIds`, `FormSection`, `FormActions`, `ChoiceCard`,
  `ConfirmDialog`.
- Sign in / sign up: `AuthPanel` (code, magic link or password; Google, Apple,
  GitHub, Microsoft, LinkedIn, X, SAML SSO), `AuthScreen`, `AuthBackdrop`, and
  the provider glyphs.
- The gallery is rebuilt in the site's own chrome with admin, table, form and
  auth demos.

## [0.1.0] — 2026-09-02

First extraction from aisocratic.org.

### Added

- Typed token source (`src/tokens`): semantic colours in light and dark, the
  nine-step golden-ratio type scale, the φ radius ladder, three font roles as
  app-filled slots, the page-shell measure, and brand constants.
- Generated outputs: `tailwind.css` (Tailwind v4 theme), `tokens.css` (plain
  custom properties), `tokens.json`, and a React-Native-shaped `native` export.
- `cn()` with the type-scale-aware `tailwind-merge`, and the shared control
  variants (`controlBase`, `controlSize`, `controlColor`, `fieldVariants`).
- React primitives: Section family, Button, Badge, Card, Input, Textarea,
  Label, Select, Dialog, Sheet, Popover, Tooltip, Tabs, DropdownMenu,
  ScrollArea, Progress, Avatar, Checkbox, Switch, Command, Table, Alert,
  Skeleton, Spinner, EmptyState, Collapsible, Sonner toaster.
- Brand: `LogoMark`, `Wordmark`.
- Semantic status tokens (`--status-success` … `--status-accent`); `Badge`
  tones now use them instead of raw palette classes.
- Theme selectors that serve next-themes (`.dark`), a `data-theme` attribute,
  and OS preference from one stylesheet.
- Docs, an installable Claude Code skill, and a gallery site.

### Changed (vs the source codebase)

- Display face is Newsreader 200 (OFL). The previous licensed face is not
  shipped and no font binary ever will be.
- No `--font-mono` alias: use `font-body` or `font-code`.
