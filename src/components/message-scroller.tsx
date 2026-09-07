"use client"

import * as React from "react"
import { cn } from "../cn.js"
import { Button } from "./button.js"
/** Follow new messages only while the reader is already at the bottom. */
export function MessageScroller({
  children,
  className,
  label = "Conversation",
  ...props
}: Omit<React.ComponentProps<"div">, "onScroll"> & { label?: string }) {
  const viewport = React.useRef<HTMLDivElement>(null)
  const content = React.useRef<HTMLDivElement>(null)
  const following = React.useRef(true)
  const [atBottom, setAtBottom] = React.useState(true)
  React.useEffect(() => {
    const node = viewport.current
    const inner = content.current
    if (!node || !inner) return
    const follow = () => {
      if (following.current) node.scrollTop = node.scrollHeight
    }
    follow()
    const observer = new ResizeObserver(follow)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])
  return (
    <div className="relative">
      <div
        {...props}
        ref={viewport}
        role="log"
        aria-label={label}
        aria-live="polite"
        // The scrollable conversation must be reachable for keyboard scrolling.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cn(
          "h-80 overflow-y-auto rounded-xl border border-border p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        onScroll={(e) => {
          const node = e.currentTarget
          following.current = node.scrollHeight - node.scrollTop - node.clientHeight < 24
          setAtBottom(following.current)
        }}
      >
        <div ref={content} className="space-y-4">
          {children}
        </div>
      </div>
      {!atBottom && (
        <Button
          className="absolute bottom-3 end-3"
          size="sm"
          onClick={() => {
            following.current = true
            setAtBottom(true)
            viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: "smooth" })
          }}
        >
          Latest messages ↓
        </Button>
      )}
    </div>
  )
}
