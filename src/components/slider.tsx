"use client"

import * as React from "react"
import { cn } from "../cn.js"
import * as P from "@radix-ui/react-slider"
export function Slider({
  className,
  value,
  defaultValue = [0],
  thumbLabels,
  ...props
}: React.ComponentProps<typeof P.Root> & { thumbLabels?: string[] }) {
  return (
    <P.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-40 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        className,
      )}
      value={value}
      defaultValue={defaultValue}
      {...props}
    >
      <P.Track className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2">
        <P.Range className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </P.Track>
      {(value ?? defaultValue).map((_, i) => (
        <P.Thumb
          key={i}
          aria-label={thumbLabels?.[i] ?? props["aria-label"] ?? `Value ${i + 1}`}
          className="block size-5 rounded-full border border-primary bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ))}
    </P.Root>
  )
}
