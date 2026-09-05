"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ChevronDown, Menu, X } from "lucide-react"
import { useState, type ElementType, type ReactNode } from "react"

import { cn } from "../cn.js"
import { Button } from "./button.js"

export type MobileMenuItem = {
  label: ReactNode
  href?: string
  active?: boolean
  /** An expandable group — "More → Workshops, Labs, …". */
  children?: { href: string; label: ReactNode; active?: boolean }[]
}

/**
 * The burger menu from aisocratic.org, for the `menu` slot of `SiteHeader`.
 *
 * A non-modal Radix Dialog: the overlay is `z-30`, the panel `z-40`, and
 * the header `z-50`, so the header and its X toggle stay visible and
 * clickable above the open panel. The panel has its own surface
 * (`bg-background/95`): links directly over the blurred page were
 * unreadable. `pt-32` = the 104px header plus a 24px gap, and the nav is a
 * `page-shell` so links start on the brand's gridline.
 */
export function MobileMenu({
  items,
  footer,
  linkComponent,
  className,
}: {
  items: MobileMenuItem[]
  /** Below the links, after a rule — sign in / join. */
  footer?: ReactNode
  linkComponent?: ElementType
  className?: string
}) {
  const L = linkComponent ?? "a"
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  const topLevel = (active?: boolean) =>
    cn(
      "text-title uppercase tracking-[0.08em] py-2 transition-colors duration-150 ease-out",
      active ? "text-foreground font-semibold" : "text-foreground/60 hover:text-foreground",
    )

  return (
    <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" className={cn("group", className)} aria-label="Open menu">
          <Menu className="group-data-[state=open]:hidden" />
          <X className="hidden group-data-[state=open]:block" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <button
          type="button"
          aria-label="Close menu"
          data-overlay="true"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <Dialog.Content
          onInteractOutside={(e) => {
            if (e.target instanceof HTMLElement && e.target.dataset.overlay !== "true") e.preventDefault()
          }}
          className="fixed top-0 left-0 z-40 max-h-screen w-full overflow-y-auto border-b border-border bg-background/95 pt-32 pb-10 backdrop-blur-md"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <nav className="page-shell flex flex-col space-y-2">
            {items.map((item, i) => {
              if (!item.children?.length) {
                return (
                  <L key={i} href={item.href ?? "#"} onClick={() => setOpen(false)} className={topLevel(item.active)}>
                    {item.label}
                  </L>
                )
              }
              const isOpen = expanded.has(i)
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className={cn(topLevel(item.active), "flex w-full items-center justify-between")}
                  >
                    {item.label}
                    <ChevronDown className={cn("size-5 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen ? (
                    <div className="mt-1 mb-2 flex flex-col border-l border-border pl-4">
                      {item.children.map((child) => (
                        <L
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "py-1.5 text-body",
                            child.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {child.label}
                        </L>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
            {footer ? <div className="mt-6 border-t border-border pt-4">{footer}</div> : null}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
