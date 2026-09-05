"use client"

import { Search, X } from "lucide-react"
import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { cn } from "../cn.js"
import { fieldVariants } from "../control-variants.js"
import { Input } from "./input.js"
import { Textarea } from "./textarea.js"

/**
 * The light half of the form-field set: `FieldWrapper`, `useFieldIds`,
 * `TextField`, `SearchField`. No optional peer, so a text-only consumer pulls
 * in nothing else. `SelectField`, `ToggleField` and `DateField`-style
 * controls compose the same wrapper from their own subpaths.
 *
 * Every field carries its own label, description and error chrome and wires
 * `aria-describedby` / `aria-invalid`. Never compose raw label + input +
 * error text inline.
 */

/** The `<label>` recipe, the same one `components/label` renders. */
export const labelClass =
  "flex items-center gap-2 text-body leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"

export function FieldWrapper({
  id,
  label,
  labelClassName,
  description,
  error,
  required,
  className,
  inline,
  children,
}: {
  id: string
  label?: React.ReactNode
  /** Styles the `<label>` itself while keeping a real `htmlFor` association. */
  labelClassName?: string
  description?: string
  error?: string
  required?: boolean
  className?: string
  /** Control first, then the label block beside it — toggles and checkboxes. */
  inline?: boolean
  children: React.ReactNode
}) {
  const descId = `${id}-desc`
  const errId = `${id}-err`
  const labelEl = label ? (
    <label htmlFor={id} className={cn(labelClass, labelClassName)}>
      {label}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </label>
  ) : null
  const meta = (
    <>
      {description ? (
        <p id={descId} className="text-micro text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-micro text-destructive">
          {error}
        </p>
      ) : null}
    </>
  )

  if (inline) {
    return (
      <div className={cn("flex items-start gap-2", className)}>
        {children}
        <div className="grid gap-1 leading-none">
          {labelEl}
          {meta}
        </div>
      </div>
    )
  }
  return (
    <div className={cn("grid gap-1.5", className)}>
      {labelEl}
      {children}
      {meta}
    </div>
  )
}

/** A stable id for a field and the `aria-describedby` that points at its description and error. */
export function useFieldIds(error?: string, description?: string) {
  const id = React.useId()
  const ariaDescribedBy = [description ? `${id}-desc` : undefined, error ? `${id}-err` : undefined].filter(Boolean).join(" ") || undefined
  return { id, ariaDescribedBy }
}

/* ------------------------------------------------------------- TextField */

type FieldExtras = {
  label?: React.ReactNode
  labelClassName?: string
  description?: string
  error?: string
  variant?: VariantProps<typeof fieldVariants>["variant"]
  /** Styles the inner control; `className` styles the wrapper. */
  inputClassName?: string
  /** Static leading segment flush against the input — `https://`, `@`. Single-line only. */
  prefix?: React.ReactNode
  /** A glyph overlaid inside the input's leading edge. Single-line only; ignored with `prefix`. */
  leadingIcon?: React.ReactNode
}

export type TextFieldProps =
  | (Omit<React.ComponentProps<"input">, "id" | "prefix"> & FieldExtras & { multiline?: false })
  | (Omit<React.ComponentProps<"textarea">, "id"> & FieldExtras & { multiline: true })

/** The one labelled text input. `multiline` swaps in a textarea with the same chrome. */
export function TextField({
  label,
  labelClassName,
  description,
  error,
  required,
  className,
  inputClassName,
  prefix,
  leadingIcon,
  variant,
  multiline,
  ...control
}: TextFieldProps) {
  const { id, ariaDescribedBy } = useFieldIds(error, description)
  const shared = { id, required, variant, "aria-invalid": !!error, "aria-describedby": ariaDescribedBy }
  return (
    <FieldWrapper
      id={id}
      label={label}
      labelClassName={labelClassName}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      {multiline ? (
        <Textarea {...shared} className={inputClassName} {...(control as Omit<React.ComponentProps<"textarea">, "id">)} />
      ) : prefix != null ? (
        <div className="flex w-full">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-border bg-muted px-3 font-code text-body text-muted-foreground">
            {prefix}
          </span>
          <Input {...shared} className={cn("rounded-l-none", inputClassName)} {...(control as Omit<React.ComponentProps<"input">, "id">)} />
        </div>
      ) : leadingIcon != null ? (
        <div className="relative flex w-full">
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg]:size-3.5">
            {leadingIcon}
          </span>
          <Input {...shared} className={cn("pl-9", inputClassName)} {...(control as Omit<React.ComponentProps<"input">, "id">)} />
        </div>
      ) : (
        <Input {...shared} className={inputClassName} {...(control as Omit<React.ComponentProps<"input">, "id">)} />
      )}
    </FieldWrapper>
  )
}

/* ----------------------------------------------------------- SearchField */

/**
 * The filter-bar search box — magnifier left, clear button right. Built on
 * `fieldVariants` so it matches the `SelectField` beside it on more than
 * height. NOT a form field: no label, description or error chrome.
 */
export function SearchField({
  value,
  onValueChange,
  onClear,
  clearable = true,
  placeholder = "Search...",
  className,
  containerClassName,
  rightSlot,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value: string
  onValueChange: (value: string) => void
  onClear?: () => void
  clearable?: boolean
  rightSlot?: React.ReactNode
  containerClassName?: string
}) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={cn(fieldVariants(), "h-8 pr-10 pl-10", className)}
        {...props}
      />
      {value && clearable ? (
        <button
          type="button"
          onClick={() => {
            onValueChange("")
            onClear?.()
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : rightSlot ? (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">{rightSlot}</div>
      ) : null}
    </div>
  )
}
