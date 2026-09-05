import type { ComponentProps, ElementType, ReactNode } from "react"

import { cn } from "../cn.js"

/**
 * The public site's header, as on aisocratic.org: out of flow (`absolute
 * top-0`), the brand on the left, the navigation centred on the bar, and
 * whatever the app needs on the right — a theme toggle, a user menu, a
 * "join" button. It scrolls away with the page and reserves no space, so the
 * first `Section` on a page takes `lead` to clear it.
 *
 * Geometry (load-bearing for `Section lead`): `pt-6` (24) + `py-4` (16 + 16)
 * + a 48px brand row = **104px** — `shell.header`. The bar is a `page-shell`,
 * so the brand starts on the first content gridline and the right-hand
 * controls end on the last one. `relative` on the bar is required: the nav
 * is absolutely centred and would otherwise centre on the viewport.
 *
 * Links render as `<a>` unless a `linkComponent` (Next's `Link`) is passed;
 * the package imports no router. The nav is hidden below `lg`, where the
 * `menu` slot (a `MobileMenu`) takes over.
 */
export type NavItem = {
  href: string
  label: ReactNode
  /** Marks the current section. Compute it from the router in the app. */
  active?: boolean
}

/** The header nav link recipe on aisocratic.org: uppercase, tracked, muted until active. */
export function navLinkClass(active: boolean | undefined, className?: string) {
  return cn(
    "font-body text-nav transition-colors duration-150 ease-out",
    active ? "text-foreground font-semibold" : "text-foreground/50 hover:text-foreground/80",
    className,
  )
}

export function SiteHeader({
  brand,
  links,
  actions,
  menu,
  linkComponent,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  /** The lockup, wrapped in a link to home by the app. */
  brand: ReactNode
  links?: NavItem[]
  /** Right-hand slot on desktop. */
  actions?: ReactNode
  /** Right-hand slot below `lg`, usually a `MobileMenu` trigger. */
  menu?: ReactNode
  /** `Link` from next/link, or any component taking `href`. Defaults to `<a>`. */
  linkComponent?: ElementType
}) {
  const L = linkComponent ?? "a"
  return (
    <div className={cn("absolute top-0 left-0 z-50 w-full pt-6", className)} {...props}>
      <header className="page-shell relative flex items-center justify-between py-4">
        <div className="flex h-12 items-center">{brand}</div>
        {links?.length ? (
          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-x-8 max-lg:hidden">
            {links.map((link) => (
              <L key={link.href} href={link.href} className={navLinkClass(link.active)} aria-current={link.active ? "page" : undefined}>
                {link.label}
              </L>
            ))}
          </nav>
        ) : null}
        <div className="flex items-center gap-2 max-lg:hidden">{actions}</div>
        <div className="flex items-center gap-2 lg:hidden">{menu ?? actions}</div>
      </header>
    </div>
  )
}
