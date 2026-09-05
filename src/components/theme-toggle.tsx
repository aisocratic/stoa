"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { cn } from "../cn.js"

const emptySubscribe = () => () => {}

/**
 * The sun/moon button from aisocratic.org's header. A 32px circle with a
 * generous hit area (`before:-inset-1.5`), so it sits on the same rung as
 * every other header control.
 *
 * `next-themes` resolves the theme on the client, so the server snapshot
 * is "not mounted" and the icon only becomes theme-aware after hydration —
 * no mismatch, no flash of the wrong icon.
 */
export function ThemeToggle({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
  const dark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "relative inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-secondary before:absolute before:-inset-1.5 before:content-['']",
        className,
      )}
      aria-label={mounted ? `Switch to ${dark ? "light" : "dark"} mode` : "Toggle theme"}
    >
      {dark ? (
        <Sun className={cn("size-3.5 text-foreground", iconClassName)} />
      ) : (
        <Moon className={cn("size-3.5 text-foreground", iconClassName)} />
      )}
    </button>
  )
}
