import { Fragment, type ElementType } from "react"

import { cn } from "../cn.js"

export type BreadcrumbItem = {
  label: string
  /** Omit on the last crumb — it is the current page, not a link. */
  href?: string
}

/**
 * The orientation line on admin pages: `Events / Venues / Talent Garden`,
 * in mono. It also renders the page's `sr-only` `<h1>`, so every route keeps
 * exactly one accessible page name in one place. A single item renders the
 * accessible name and nothing visible: a top-level section needs no trail
 * (the sidebar highlight is the trail), but it still needs a name.
 *
 * The public site's variant (`chevron`) uses a chevron separator on the
 * micro step; pass the JSON-LD alongside it from the app.
 */
export function Breadcrumbs({
  items,
  title,
  separator = "slash",
  linkComponent,
  className,
}: {
  items: BreadcrumbItem[]
  /** Accessible page name; defaults to the last crumb's label. */
  title?: string
  separator?: "slash" | "chevron"
  linkComponent?: ElementType
  className?: string
}) {
  const L = linkComponent ?? "a"
  const lastIndex = items.length - 1
  const accessibleName = title ?? items[lastIndex]?.label ?? ""

  if (items.length < 2) return accessibleName ? <h1 className="sr-only">{accessibleName}</h1> : null

  return (
    <div className={cn("min-w-0", className)}>
      <h1 className="sr-only">{accessibleName}</h1>
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-muted-foreground",
          separator === "slash" ? "font-code text-micro" : "text-micro",
        )}
      >
        {items.map((item, i) => {
          const isLast = i === lastIndex
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 ? (
                separator === "slash" ? (
                  <span aria-hidden className="text-muted-foreground/50">
                    /
                  </span>
                ) : (
                  <svg
                    aria-hidden
                    className="size-3 shrink-0 opacity-60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )
              ) : null}
              {item.href && !isLast ? (
                <L href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </L>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn("truncate", isLast && "text-foreground")}>
                  {item.label}
                </span>
              )}
            </Fragment>
          )
        })}
      </nav>
    </div>
  )
}
