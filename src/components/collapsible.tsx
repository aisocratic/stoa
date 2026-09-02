"use client"

import * as React from "react"

import { cn } from "../cn.js"

type CollapsibleContextValue = {
  open: boolean
  toggle: () => void
  contentId: string
  disabled: boolean
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

function useCollapsibleContext(component: string): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within a <Collapsible>`)
  }
  return ctx
}

type CollapsibleProps = React.ComponentProps<"div"> & {
  /** Controlled open state. Omit (and optionally pass `defaultOpen`) for uncontrolled use. */
  open?: boolean
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean
  /** Called with the next open state whenever the trigger is activated. */
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

/**
 * Dependency-free collapsible (no Radix). Unstyled beyond a plain `div` per
 * part, so hand-rolled chevron-toggle cards can adopt it with visual parity —
 * pass the existing card classes via `className`.
 *
 * - `Collapsible` renders a `div` with `data-state="open" | "closed"` and
 *   provides context. Controlled (`open` + `onOpenChange`) or uncontrolled
 *   (`defaultOpen`).
 * - `CollapsibleTrigger` renders a semantic `<button type="button">` with
 *   `aria-expanded` / `aria-controls`, or merges those props onto its child
 *   element with `asChild` (e.g. to make a whole card header the toggle).
 *   When that child is not itself a native button (typically a layout `<div>`
 *   card header), the trigger also gives it `role="button"`, `tabIndex` and
 *   Enter/Space handling — without them the merged `aria-expanded` sits on an
 *   implicit `role="generic"` element, which is both an `aria-allowed-attr`
 *   failure and a control no keyboard user can reach.
 * - `CollapsibleContent` renders its children in a `div` only while open
 *   (unmounted when closed, matching conditional-render behavior).
 */
function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen
  const contentId = React.useId()

  const toggle = React.useCallback(() => {
    if (disabled) return
    const next = !open
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }, [disabled, open, isControlled, onOpenChange])

  const contextValue = React.useMemo(
    () => ({ open, toggle, contentId, disabled }),
    [open, toggle, contentId, disabled],
  )

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div
        data-slot="collapsible"
        data-state={open ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

type CollapsibleTriggerProps = React.ComponentProps<"button"> & {
  /**
   * Merge trigger behavior (onClick toggle, aria-expanded, aria-controls,
   * data-state) onto the single child element instead of rendering a button.
   */
  asChild?: boolean
}

function CollapsibleTrigger({
  asChild = false,
  onClick,
  className,
  children,
  ...props
}: CollapsibleTriggerProps) {
  const { open, toggle, contentId, disabled } = useCollapsibleContext("CollapsibleTrigger")

  const sharedProps = {
    "aria-expanded": open,
    "aria-controls": contentId,
    "data-state": open ? "open" : "closed",
    "data-slot": "collapsible-trigger",
  } as const

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>
    const childOnClick = child.props.onClick as React.MouseEventHandler | undefined
    const childOnKeyDown = child.props.onKeyDown as React.KeyboardEventHandler | undefined

    // A `<div>` carrying aria-expanded keeps its implicit `role="generic"`,
    // which does not support the attribute (axe/Lighthouse `aria-allowed-attr`)
    // and is not focusable. Promote it to a real button in the a11y tree unless
    // the caller already passed a native button or an explicit role.
    const isNativeButton = child.type === "button"
    const hasExplicitRole = child.props.role !== undefined
    const needsButtonSemantics = !isNativeButton && !hasExplicitRole

    return React.cloneElement(child, {
      ...sharedProps,
      ...(needsButtonSemantics
        ? { role: "button", tabIndex: (child.props.tabIndex as number | undefined) ?? 0 }
        : {}),
      ...props,
      className: cn(child.props.className as string | undefined, className),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        childOnClick?.(event)
        onClick?.(event)
        if (!event.defaultPrevented) toggle()
      },
      ...(needsButtonSemantics
        ? {
            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
              childOnKeyDown?.(event)
              if (event.defaultPrevented) return
              if (event.key !== "Enter" && event.key !== " ") return
              // Space would scroll the page; Enter would submit an enclosing form.
              event.preventDefault()
              toggle()
            },
          }
        : {}),
    })
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={className}
      {...sharedProps}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggle()
      }}
    >
      {children}
    </button>
  )
}

function CollapsibleContent({ children, ...props }: React.ComponentProps<"div">) {
  const { open, contentId } = useCollapsibleContext("CollapsibleContent")

  if (!open) return null

  return (
    <div id={contentId} data-slot="collapsible-content" data-state="open" {...props}>
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
