"use client"

import { useState, type ComponentProps } from "react"
import { cn } from "../cn.js"
import { Input } from "./input.js"
/** One native input preserves autofill and screen-reader editing. Pasting strips separators. */
export function InputOTP({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  className,
  onPaste,
  ...props
}: Omit<ComponentProps<typeof Input>, "onChange" | "value" | "defaultValue" | "type" | "maxLength"> & {
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [internal, setInternal] = useState(defaultValue)
  const update = (text: string) => {
    const next = text.replace(/[^0-9]/g, "").slice(0, length)
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }
  return (
    <Input
      aria-label="Verification code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern={`[0-9]{${length}}`}
      {...props}
      className={cn("font-code tracking-[0.5em]", className)}
      type="text"
      value={value ?? internal}
      maxLength={length}
      onChange={(e) => update(e.target.value)}
      onPaste={(e) => {
        onPaste?.(e)
        if (!e.defaultPrevented) {
          e.preventDefault()
          update(e.clipboardData.getData("text"))
        }
      }}
    />
  )
}
