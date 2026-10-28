import { Slot } from "@radix-ui/react-slot"
import { createContext, useContext, useState, type ReactNode } from "react"

/*
 * Radix's popper (floating-ui) stalls jsdom for seconds per mounted popover,
 * so tests of what sits inside a popover swap it for this plain disclosure:
 * `vi.mock("../src/components/popover.js", () => import("./popover-mock.js"))`.
 */
const Open = createContext<[boolean, (open: boolean) => void]>([false, () => undefined])

export function Popover({
  children,
  open: controlled,
  onOpenChange,
}: {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolled, setUncontrolled] = useState(false)
  const open = controlled ?? uncontrolled
  const set = (next: boolean) => {
    setUncontrolled(next)
    onOpenChange?.(next)
  }
  return <Open.Provider value={[open, set]}>{children}</Open.Provider>
}

export function PopoverTrigger({ children }: { children: ReactNode; asChild?: boolean }) {
  const [open, setOpen] = useContext(Open)
  return <Slot onClick={() => setOpen(!open)}>{children}</Slot>
}

export function PopoverContent({ children, className }: { children: ReactNode; className?: string }) {
  return useContext(Open)[0] ? (
    <div role="dialog" className={className}>
      {children}
    </div>
  ) : null
}
