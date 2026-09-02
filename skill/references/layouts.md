# Page layouts (public site)

Canonical skeleton lives in `@aisocratic/stoa` (`Section`). It formalizes what older
pages hand-rolled (~21 different section paddings, ~30 heading blocks, 10 header
clearances). The aisocratic.org home page is the reference implementation; the class
recipes below are the shared visual language.

## Page skeleton

```tsx
export const metadata: Metadata = buildPageMetadata({
  title: "Page Title",
  description: "…",
  path: "/page",
  image: `/api/og?title=${encodeURIComponent("Page Title")}`, // or omit → site default OG
})

export default function Page() {
  return (
    <main className="min-h-screen text-foreground">
      {/* h1: either a visible PageHero, or sr-only when the page opens straight into a feed */}
      <Section lead size="md">           {/* lead = clears the fixed 104px header */}
        <PageHero
          eyebrow="Community"
          title="Page Title"
          subtitle="One sentence of standfirst."
          size="hero"                     {/* display = inner page, hero = default, mega = statement */}
          actions={<ButtonLink href="/join" variant="cta" size="lg">Join</ButtonLink>}
        />
      </Section>
      <Section size="md" divider>
        <SectionHeading
          eyebrow="What's on"
          title="Section title"
          subtitle="Optional supporting line."
          actions={<CtaLink href="/all" location="section" label="View all">View all →</CtaLink>}
        />
        {/* content */}
      </Section>
    </main>
  )
}
```

## `@aisocratic/stoa` (`Section`) API

- **`Section`** — owns vertical rhythm + width (wraps children in `page-shell` unless
  `shell={false}`). Props: `size` `"sm"|"md"|"lg"` (φ-spaced 40/64/104px pt+pb),
  `tone` `"default"|"dark"|"none"`, `lead` (first section of the page: adds fixed-header
  clearance → `pt-36/42/52`), `divider` (top border), `innerClassName`.
  Don't put competing `max-w-*` via `innerClassName` — nest a div instead.
- **`SectionHeading`** — eyebrow/title/subtitle block for marketing sections.
  Props: `eyebrow`, `title`, `subtitle`, `align` `"left"|"center"`, `as` `"h2"|"h3"`,
  `actions` (right-aligned slot, e.g. "View all →").
  Recipe it encodes: eyebrow `text-micro uppercase tracking-[0.14em] text-primary mb-2`;
  title `font-display text-section text-foreground`; subtitle
  `text-body text-muted-foreground mt-3 max-w-[60ch]`; wrapper `mb-8`.
- **`RuledHeading`** — lighter feed-band label set into a rule (`— Title (n) ———`),
  `font-display text-title`. Use to LABEL a feed band (Home "The Latest in AI",
  Events "Upcoming"), not to open a marketing section.
- **`PageHero`** — the page's one true `h1`. Props: `eyebrow`, `title`, `subtitle`,
  `size` `"display"|"hero"|"mega"`, `align` (center default), `actions`.
  Subtitle recipe: `text-lead text-muted-foreground mt-4 max-w-[58ch]`.

Header note: the site header is out-of-flow (`absolute top-0`, it scrolls away
with the page), 104px tall, and reserves no flow space — every page must clear
it. Use `Section lead`; do NOT copy the legacy `<main className="pt-32 pb-24">`
from News/Blog/Events. Full chrome geometry below.

## Site chrome: header + mobile menu

`components/header.tsx` + `components/mobile-menu.tsx` are the only site chrome.
Do not re-derive these numbers — they are load-bearing for every page's `lead`
clearance.

**Header geometry (all breakpoints):**
- Wrapper: `absolute top-0 z-50 pt-6 left-0 w-full` (blog posts: same bar,
  absolutely positioned over the hero image, fades out past 100px scroll).
- Bar: `page-shell relative flex items-center justify-between py-4`. The
  `relative` is required — the desktop nav is absolutely centered on the bar
  (`absolute left-1/2 -translate-x-1/2`) and would centre on the viewport
  without it.
- Total height = 24 (`pt-6`) + 16 + 48 (`Logo h-12 w-auto`) + 16 = **104px**.
  Logo and controls share centre-line y=64. Side gutters come from `page-shell`
  (16px mobile, 24px `md:`) so the logo starts on the first content gridline.
- Mobile (`max-lg`): right side is `NotificationBell` (32px slot always
  reserved, even signed-out, to avoid hydration shift) + the `MobileMenu`
  hamburger (`Button variant="ghost" size="icon"`, 32px).

**Mobile menu (Radix Dialog, non-modal):**
- Overlay: `fixed z-30 inset-0 bg-black/50 backdrop-blur-sm`.
- Panel: `fixed top-0 left-0 w-full z-40 bg-background/95 backdrop-blur-md
  border-b border-border pt-32 pb-10 max-h-screen overflow-y-auto`.
  `pt-32` (128px) = 104px header + 24px gap. The panel MUST have its own
  surface (`bg-background/95`) — links directly over the blurred page were
  unreadable; don't regress to a transparent panel.
- Z ladder for chrome: overlay 30 < panel 40 < header 50 — the header (and its
  X toggle) stays visible and clickable above the open panel.
- Nav wrapper: `page-shell` (NOT `container`) so links start on the logo's
  gridline at every breakpoint.
- Top-level links: `text-title uppercase tracking-[0.08em] py-2`; active
  `text-foreground font-semibold`, idle `text-foreground/60
  hover:text-foreground/100`. Expandable sections add a rotating `ChevronDown`.
- Submenu children: `text-body py-1.5` inside `border-l border-border pl-4`.
- Footer row: `UserNav showName inMenu` after `mt-6 pt-4 border-t
  border-border` (Join Us / Sign In).
- The file is in the type-scale MIGRATED set (`tests/type-scale-drift.test.ts`)
  — no stock Tailwind sizes may return.

**Admin sidebar (mobile, `app/(admin)/admin/layout.tsx`):** separate chrome.
In-flow mobile top bar (`lg:hidden … p-4 border-b`), and the sidebar is a
left drawer `fixed inset-y-0 left-0 z-50 h-screen bg-card border-r` that
slides via `translate-x`; it carries its own logo block, so it starts at
viewport top by design.

## h1 conventions

- Page opens with a visual hero → `PageHero` renders the h1.
- Page opens straight into a feed (Home, Events) → `<h1 className="sr-only">…</h1>`
  with a descriptive sentence, first visible element is the feed/filters.
- Simple index with a small visible title (News) → `font-display text-page text-foreground`.

## Grids and cards

- **Story/feature grid** (identical string on Home, Blog, Events):
  `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 items-start`;
  a featured item spans the row with `sm:col-span-2 lg:col-span-3`.
- **Open editorial tile** — `StoryTile` (`components/home/…`) / `EventStoryTile`:
  image + `font-display` headline, NO card box/border. Sizes `small`/`large`
  (large = full-row feature strip, alternate sides with `flip`). This is the default
  for content feeds.
- **Boxed card** — `BlogPostCard` recipe:
  `flex flex-col border rounded-lg overflow-hidden bg-card transition-colors group hover:border-primary/40`.
  For generic surfaces use `Card`/`cardSurface` from `@aisocratic/stoa` (`Card`).
- **Empty states** — `EmptyState` from `@aisocratic/stoa` (`EmptyState`)
  (`variant="panel"` for the dashed box).

## Buttons in page context (recurring recipes)

Prefer `Button`/`ButtonLink` variants; the equivalent raw recipes seen across pages:
- Primary: `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-body font-medium hover:bg-primary/90 transition-colors`
- Secondary/outline: `inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border rounded-lg text-body text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors`

## SEO / metadata

- Index pages: one metadata builder per app (`buildPageMetadata({ title, description, path, image? })`
  on aisocratic.org); `image` typically a generated OG card, omitted for the site default.
  Home uses `title: { absolute: SITE_TITLE }` to escape the `%s | AI Socratic` template.
- Articles (`/blog/[slug]`): `buildArticleMetadata(...)` + `buildArticleJsonLd(...)`
  (separate pipeline; handles drafts → noindex, redirects).
- Every listing page emits JSON-LD (at minimum `BreadcrumbList`) via inline
  `<script type="application/ld+json">` or the `<JsonLd data={…}>` component.
- Article/prose pages use the narrower `container max-w-4xl mx-auto px-4` reading
  measure instead of `page-shell` — correct for prose only.

## Marketing patterns

- Closing CTA band: `Section size="md" divider` + centered `max-w-2xl mx-auto text-center`,
  h2 `text-section font-display mb-4`, body `text-lead text-muted-foreground mb-8`
  (see `components/home/home-cta.tsx`). `components/marketing-cta.tsx` exists but is
  used on other pages (/labs, /workshops) — check before adding a new CTA band shape.
- Newsletter prompts: `NewsletterPrompt` / `components/newsletter-form.tsx` (the
  terminal-styled form is a deliberate one-off — don't copy its raw input for
  normal forms).
- Stats: `AnimatedStat` + `stat-grid` patterns, `grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8`.

## Anti-patterns (seen in legacy pages — do not copy)

- Hand-rolled dark bands `bg-black text-white border-t border-neutral-800` with
  ad-hoc `py-*` values (About) → use `Section tone="dark" divider`.
- `pt-32 pb-24` on `<main>` (News/Blog/Events) → use `Section lead`.
- Manual responsive heading chains `text-section sm:text-display lg:text-mega`
  (About's ParallaxHero) → the fluid steps already clamp; pick one.
- Raw `neutral-*` text colors on dark bands → prefer tokens.
