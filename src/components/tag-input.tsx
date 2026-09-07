"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Input } from "./input.js"
import { Button } from "./button.js"
export function TagInput({
  value,
  onValueChange,
  label = "Tags",
  disabled = false,
}: {
  value: string[]
  onValueChange: (tags: string[]) => void
  label?: string
  disabled?: boolean
}) {
  const [draft, setDraft] = React.useState("")
  const id = React.useId()
  const add = () => {
    const tag = draft.trim()
    if (tag && !value.includes(tag)) onValueChange([...value, tag])
    setDraft("")
  }
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-body">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 text-micro">
            {tag}
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              disabled={disabled}
              aria-label={`Remove ${tag}`}
              onClick={() => onValueChange(value.filter((t) => t !== tag))}
            >
              <X className="size-3" />
            </Button>
          </span>
        ))}
      </div>
      <Input
        id={id}
        value={draft}
        disabled={disabled}
        placeholder="Type a label and press Enter"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (!e.nativeEvent.isComposing && (e.key === "Enter" || e.key === ",")) {
            e.preventDefault()
            add()
          }
        }}
      />
    </div>
  )
}
