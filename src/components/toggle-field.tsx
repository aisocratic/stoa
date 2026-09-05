"use client"

import type { ReactNode } from "react"

import { Checkbox } from "./checkbox.js"
import { FieldWrapper, useFieldIds } from "./field.js"
import { Switch } from "./switch.js"

/**
 * A single labelled boolean. A checkbox by default, a switch with
 * `control="switch"` — both share the same label/description/error chrome.
 */
export function ToggleField({
  control = "checkbox",
  label,
  description,
  error,
  required,
  className,
  checked,
  onCheckedChange,
  disabled,
}: {
  control?: "checkbox" | "switch"
  label?: ReactNode
  description?: string
  error?: string
  required?: boolean
  className?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}) {
  const { id, ariaDescribedBy } = useFieldIds(error, description)
  return (
    <FieldWrapper id={id} label={label} description={description} error={error} required={required} className={className} inline>
      {control === "switch" ? (
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
        />
      ) : (
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onCheckedChange?.(v === true)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
        />
      )}
    </FieldWrapper>
  )
}
