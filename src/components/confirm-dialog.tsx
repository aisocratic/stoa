"use client"

import { useEffect, useState, type ReactNode } from "react"

import { Button } from "./button.js"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog.js"

/**
 * The one confirmation dialog — never a native `confirm()`. Destructive by
 * default; pass `tone="default"` for a non-destructive confirmation.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete item",
  description = "Are you sure? This action cannot be undone.",
  loading = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "destructive",
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  title?: ReactNode
  description?: ReactNode
  loading?: boolean
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  tone?: "destructive" | "default"
  /** Extra content between the description and the buttons. */
  children?: ReactNode
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const busy = loading || pending

  useEffect(() => {
    if (!open) setError(null)
  }, [open])

  const handleConfirm = async () => {
    if (busy) return
    setPending(true)
    setError(null)
    try {
      await onConfirm()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The action could not be completed. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {error ? (
          <p role="alert" className="text-body text-destructive">
            {error}
          </p>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "destructive" ? "destructive" : "default"} onClick={() => void handleConfirm()} loading={busy}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
