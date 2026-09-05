import type React from "react"

import { cn } from "../cn.js"

/**
 * The page skeleton for the public site: `Section` owns vertical rhythm and
 * width, `SectionHeading` owns the eyebrow/title/subtitle block, `PageHero`
 * owns the one `h1`.
 *
 * These exist because the public pages had no skeleton at all. A sweep of
 * `app/(main)/**` found ~21 different `<section>` padding combinations, ~30
 * hand-written eyebrow/title/subtitle blocks, 13 copies of the centred page
 * header, and 10 different top-clearance values for one 104px header. The
 * admin dashboard has had `PageHeader` doing this job for a while
 * (`components/admin/page-header.tsx`, `docs/UI_GUIDELINES.md`); this is the
 * same idea for the side visitors actually see.
 *
 * Sizes are φ apart, like the type scale: 40 · 64 · 104. Reach for `md`.
 */

/** Padding pairs are spelled out rather than using `py-*` so that `lead` can
 *  override the top alone — `pt-*` and `py-*` are the same Tailwind layer, and
 *  which one wins depends on stylesheet order, not on the class attribute. */
const SIZE = {
  sm: { pt: "pt-10", pb: "pb-10" }, // 40
  md: { pt: "pt-16", pb: "pb-16" }, // 64 — 40 × φ
  lg: { pt: "pt-26", pb: "pb-26" }, // 104 — 64 × φ
} as const

/**
 * The header is 104px tall and absolutely positioned, so it reserves no space
 * in the flow and the first section on every page has to pay for it. Adding it
 * to the section's own top padding keeps that in one place instead of the ten
 * different `pt-*` values pages had picked.
 */
const LEAD = {
  sm: "pt-36", // 104 + 40
  md: "pt-42", // 104 + 64
  lg: "pt-52", // 104 + 104
} as const

const TONE = {
  default: "bg-background",
  /** The art-directed dark bands on /about, /workshops and /labs. */
  dark: "dark bg-background text-foreground",
  /** Inherit whatever is behind it — for sections stacked inside one canvas. */
  none: "",
} as const

export function Section({
  size = "md",
  tone = "default",
  lead = false,
  divider = false,
  shell = true,
  className,
  innerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  size?: keyof typeof SIZE
  tone?: keyof typeof TONE
  /** First section on the page: also clears the fixed header. */
  lead?: boolean
  /** Hairline rule along the top edge, for stacked bands. */
  divider?: boolean
  /** Set false for full-bleed content that manages its own width. */
  shell?: boolean
  innerClassName?: string
}) {
  return (
    <section
      className={cn(lead ? LEAD[size] : SIZE[size].pt, SIZE[size].pb, TONE[tone], divider && "border-t border-border", className)}
      {...props}
    >
      {shell ? <div className={cn("page-shell", innerClassName)}>{children}</div> : children}
    </section>
  )
}

/* ---------------------------------------------------------------- headings */

const ALIGN = {
  left: "",
  center: "text-center",
} as const

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
  actions,
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: keyof typeof ALIGN
  /** `h2` by default. Drop to `h3` for a heading nested inside another. */
  as?: "h2" | "h3"
  /** Right-aligned slot — the "View all →" link pattern on /blog. */
  actions?: React.ReactNode
  className?: string
}) {
  const heading = (
    <div className={cn(ALIGN[align], "min-w-0")}>
      {eyebrow ? <p className="text-eyebrow text-primary mb-2">{eyebrow}</p> : null}
      {/* No weight class: the display face ships one weight, so `font-bold` here would
          only ask the browser to smear it. Hierarchy comes from size. */}
      <Tag className="font-display text-section text-foreground">{title}</Tag>
      {subtitle ? (
        <p className={cn("text-body text-muted-foreground mt-3 max-w-[60ch]", align === "center" && "mx-auto")}>{subtitle}</p>
      ) : null}
    </div>
  )

  if (!actions) return <div className={cn("mb-8", className)}>{heading}</div>

  return (
    <div className={cn("mb-8 flex items-end justify-between gap-6", className)}>
      {heading}
      <div className="shrink-0">{actions}</div>
    </div>
  )
}

/**
 * A section title set INTO a rule: `— Title ————————`, with an optional count.
 *
 * This started as a module-private helper on the home feed and is shared now
 * because /events wanted the same thing and had written a plainer version of
 * it. One step down from `SectionHeading` on purpose: these label a band of
 * an index page ("The Latest in AI", "Upcoming"), they don't open a section
 * the way a marketing page's heading does.
 */
export function RuledHeading({
  title,
  count,
  as: Tag = "h2",
  className,
}: {
  title: React.ReactNode
  /** Rendered after the title, muted — "Upcoming (4)". */
  count?: number
  as?: "h2" | "h3"
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4 mb-6", className)}>
      <span className="w-8 border-t border-border" aria-hidden="true" />
      {/* nowrap: in a narrow column a two-word title broke over two lines and
          made one header a row taller than the one beside it. */}
      <Tag className="font-display text-title text-foreground shrink-0 whitespace-nowrap">
        {title}
        {count !== undefined && count > 0 ? <span className="ml-2 text-body text-muted-foreground">({count})</span> : null}
      </Tag>
      <span className="flex-1 border-t border-border" aria-hidden="true" />
    </div>
  )
}

const HERO_SIZE = {
  /** Inner pages — /news, /jobs. */
  display: "text-display",
  /** The default for a top-level page. */
  hero: "text-hero",
  /** Reserved for the statement pages, /about and /labs. */
  mega: "text-mega",
} as const

/**
 * The page's `h1`. Every public page should render exactly one — three
 * (`/labs`, `/workshops`, `/leaderboard`) currently render none at all, and
 * four hide theirs with `sr-only` and lead with an `h2` instead.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  size = "hero",
  align = "center",
  actions,
  className,
  children,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  size?: keyof typeof HERO_SIZE
  align?: keyof typeof ALIGN
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn(ALIGN[align], "mb-12", className)}>
      {eyebrow ? <p className="text-eyebrow text-primary mb-3">{eyebrow}</p> : null}
      <h1 className={cn("font-display text-foreground", HERO_SIZE[size])}>{title}</h1>
      {subtitle ? (
        <p className={cn("text-lead text-muted-foreground mt-4 max-w-[58ch]", align === "center" && "mx-auto")}>{subtitle}</p>
      ) : null}
      {actions ? (
        <div className={cn("mt-8 flex flex-col sm:flex-row items-center gap-3", align === "center" && "justify-center")}>{actions}</div>
      ) : null}
      {children}
    </div>
  )
}
