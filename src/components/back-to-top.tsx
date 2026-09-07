"use client"
import { Button } from "./button.js"
export function BackToTop() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
      }
    >
      Back to top ↑
    </Button>
  )
}
