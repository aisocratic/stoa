"use client"
import { useState } from "react"
import { Button } from "./button.js"
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("")
  return (
    <span className="inline-flex items-center gap-2">
      <Button
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text)
            setStatus("Copied")
          } catch {
            setStatus("Could not copy")
          }
        }}
      >
        {label}
      </Button>
      <span role="status" className="text-micro text-muted-foreground">
        {status}
      </span>
    </span>
  )
}
