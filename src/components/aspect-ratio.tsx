"use client"

import * as React from "react"
export function AspectRatio({ ratio = 16 / 9, style, ...props }: React.ComponentProps<"div"> & { ratio?: number }) {
  return <div style={{ aspectRatio: ratio, ...style }} {...props} />
}
