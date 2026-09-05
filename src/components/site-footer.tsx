import type { ComponentProps, ElementType, ReactNode } from "react"

import { cn } from "../cn.js"

/**
 * The public site's footer, as on aisocratic.org: a brand column with a
 * one-line description, link columns under eyebrow heads, an optional
 * trailing column (the newsletter form), then a full-bleed rule and a bottom
 * bar with the copyright line, small links and social icons.
 *
 * The rules are on full-bleed elements rather than inside the shell so they
 * span the viewport instead of stopping at the 72rem column.
 */
export type FooterColumn = {
  title: ReactNode
  links: { href: string; label: ReactNode }[]
}

const footerLink = "text-body text-muted-foreground transition-colors hover:text-foreground"

export function SiteFooter({
  brand,
  description,
  columns = [],
  aside,
  copyright,
  bottomLinks = [],
  social,
  linkComponent,
  className,
  ...props
}: Omit<ComponentProps<"footer">, "children"> & {
  brand: ReactNode
  description?: ReactNode
  columns?: FooterColumn[]
  /** Trailing column — a newsletter form, a CTA. */
  aside?: ReactNode
  /** Bottom-left line. Defaults to `© <year> AI Socratic. All rights reserved.` */
  copyright?: ReactNode
  bottomLinks?: { href: string; label: ReactNode }[]
  /** Bottom-right slot — social icon links. */
  social?: ReactNode
  linkComponent?: ElementType
}) {
  const L = linkComponent ?? "a"
  const year = new Date().getFullYear()
  return (
    <footer className={cn("border-t border-border/50 bg-background/80 backdrop-blur-md", className)} {...props}>
      <div className="page-shell py-16">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <div className="mb-4">{brand}</div>
            {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-eyebrow mb-4 text-foreground">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <L href={link.href} className={footerLink}>
                      {link.label}
                    </L>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="page-shell flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="text-body text-muted-foreground">{copyright ?? `© ${year} AI Socratic. All rights reserved.`}</p>
          <div className="flex flex-wrap items-center gap-6">
            {bottomLinks.map((link) => (
              <L key={link.href} href={link.href} className={footerLink}>
                {link.label}
              </L>
            ))}
            {social ? <div className="flex items-center gap-3 text-muted-foreground">{social}</div> : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
