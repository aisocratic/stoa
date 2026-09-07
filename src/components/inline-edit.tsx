"use client"

import * as React from "react"
import { Button } from "./button.js"
import { Input } from "./input.js"
export function InlineEdit({ value, onSave, label = "Edit value" }: { value: string; onSave: (value: string) => void; label?: string }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  return editing ? (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (draft.trim()) {
          onSave(draft.trim())
          setEditing(false)
        }
      }}
    >
      <Input
        aria-label={label}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false)
        }}
      />
      <Button type="submit">Save</Button>
      <Button variant="ghost" type="button" onClick={() => setEditing(false)}>
        Cancel
      </Button>
    </form>
  ) : (
    <button
      type="button"
      className="rounded-md text-left font-body text-body underline decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
      aria-label={label}
      onClick={() => {
        setDraft(value)
        setEditing(true)
      }}
    >
      {value}
    </button>
  )
}
