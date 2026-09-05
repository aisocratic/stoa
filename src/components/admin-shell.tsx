"use client"

import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type ComponentType, type ElementType, type KeyboardEvent, type ReactNode } from "react"

import { cn } from "../cn.js"
import { Button } from "./button.js"

export type AdminNavItem = {
  href: string
  label: string
  icon?: ComponentType<{ className?: string }>
}

/** A labelled group of links. A `null` label renders an unlabelled group. */
export type AdminNavGroup = { label: string | null; items: AdminNavItem[] }

/**
 * The /admin chrome on aisocratic.org: a fixed left sidebar on the card
 * surface — brand block, grouped body-font nav with the active item filled
 * primary, a footer with the collapse toggle and the user — and a `<main>`
 * beside it at full width with no max-width. Below `lg` the sidebar is a
 * drawer behind an in-flow top bar.
 *
 * Compact mode (icons only, 64px) persists to `localStorage` under
 * `storageKey`. It starts expanded on every render so SSR and the first
 * client render match; the saved value is restored after mount.
 *
 * `activeHref` is the longest nav href the current path starts with —
 * compute it in the app from the router and pass it in. Links render as
 * `<a>` unless a `linkComponent` (Next's `Link`) is given.
 */
export function AdminShell({
  brand,
  brandCompact,
  groups,
  activeHref,
  footer,
  topBar,
  linkComponent,
  storageKey = "admin-sidebar-compact",
  embedded = false,
  className,
  children,
}: {
  /** The lockup for the expanded sidebar, wrapped in a link by the app. */
  brand: ReactNode
  /** A square mark for the compact sidebar. Falls back to `brand`. */
  brandCompact?: ReactNode
  groups: AdminNavGroup[]
  activeHref?: string
  /** Sidebar footer — the user menu. Receives `compact`. */
  footer?: (compact: boolean) => ReactNode
  /** Left side of the mobile top bar — a title, a "view as" switch. */
  topBar?: ReactNode
  linkComponent?: ElementType
  storageKey?: string
  /** Contain the shell in its parent instead of the viewport — for a gallery or a preview frame. */
  embedded?: boolean
  className?: string
  children: ReactNode
}) {
  const L = linkComponent ?? "a"
  const drawerId = useId()
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const asideRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      try {
        setCompact(window.localStorage.getItem(storageKey) === "true")
      } catch {
        /* storage unavailable */
      }
    })
    return () => {
      cancelled = true
    }
  }, [storageKey])

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const media = window.matchMedia("(min-width: 1024px)")
    const update = () => {
      setDesktop(media.matches)
      if (media.matches) setOpen(false)
    }
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    asideRef.current?.querySelector<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])')?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open) return
    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key !== "Tab") return
    const focusable = [
      ...(asideRef.current?.querySelectorAll<HTMLElement>('a, button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []),
    ]
    if (!focusable.length) return
    const first = focusable[0]!
    const last = focusable.at(-1)!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const toggleCompact = () => {
    const next = !compact
    setCompact(next)
    try {
      window.localStorage.setItem(storageKey, String(next))
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <div className={cn(embedded ? "relative min-h-full overflow-hidden" : "min-h-screen", "bg-background", className)}>
      {/* Mobile top bar — in flow, scrolls away. */}
      <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
        <div className="font-display text-title">{topBar ?? "Admin"}</div>
        <Button
          ref={triggerRef}
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={drawerId}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Keyboard handling is on the landmark because it owns the entire focus trap. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <aside
          ref={asideRef}
          id={drawerId}
          inert={(!desktop && !open) || undefined}
          role={!desktop && open ? "dialog" : undefined}
          aria-modal={!desktop && open ? true : undefined}
          aria-label={!desktop && open ? "Admin navigation" : undefined}
          onKeyDown={handleDrawerKeyDown}
          className={cn(
            embedded ? "absolute inset-y-0 left-0 z-50 h-full border-r" : "fixed inset-y-0 left-0 z-50 h-screen border-r",
            "border-border bg-card pb-12 transition-all duration-200 lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
            compact ? "w-16" : "w-56",
          )}
        >
          <div className="flex h-full flex-col">
            <div className={cn("border-b border-border p-4", compact && "flex flex-col items-center")}>
              {compact ? (brandCompact ?? brand) : brand}
            </div>

            <nav className={cn("min-h-0 flex-1 space-y-3 overflow-y-auto p-4", compact && "px-2")}>
              {groups.map((group, gi) => (
                <div key={group.label ?? `group-${gi}`} className="space-y-1">
                  {group.label && !compact ? (
                    <p className="px-3 pt-1 pb-0.5 text-eyebrow font-body text-muted-foreground">{group.label}</p>
                  ) : null}
                  {group.label && compact ? <div className="mx-2 my-1 border-t border-border" aria-hidden /> : null}
                  {group.items.map((item) => {
                    const active = item.href === activeHref
                    const Icon = item.icon
                    return (
                      <L
                        key={item.href}
                        href={item.href}
                        title={compact ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center rounded-md font-body text-body transition-colors",
                          compact ? "justify-center p-2" : "gap-3 px-3 py-2",
                          active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        {Icon ? <Icon className="size-4 shrink-0" /> : null}
                        {!compact ? item.label : <span className="sr-only">{item.label}</span>}
                      </L>
                    )
                  })}
                </div>
              ))}
            </nav>

            <div className={cn("space-y-2 border-t border-border p-4", compact && "px-2")}>
              <div className={cn("flex items-center", compact ? "justify-center" : "justify-start")}>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={toggleCompact}
                  aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
                  className="hidden lg:flex"
                >
                  {compact ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                </Button>
              </div>
              {footer ? <div className={cn("flex items-center gap-2", compact ? "justify-center" : "pl-2")}>{footer(compact)}</div> : null}
            </div>
          </div>
        </aside>

        {open ? (
          <div
            className={cn(embedded ? "absolute" : "fixed", "inset-0 z-40 bg-black/50 lg:hidden")}
            onClick={() => setOpen(false)}
            aria-hidden
          />
        ) : null}

        <main inert={open || undefined} className={cn("min-w-0 flex-1 p-6 lg:p-8", compact ? "lg:ml-16" : "lg:ml-56")}>
          {children}
        </main>
      </div>
    </div>
  )
}
