import type { ComponentProps } from "react"
import { cn } from "../cn.js"
export function Marker({
  variant = "default",
  className,
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "border" | "separator" }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-2 font-code text-micro text-muted-foreground",
        variant === "border" && "border-b border-border",
        variant === "separator" && "before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
      {...props}
    />
  )
}
export function MarkerIcon({ className, ...props }: ComponentProps<"span">) {
  return <span aria-hidden="true" className={cn("shrink-0 [&>svg]:size-4", className)} {...props} />
}
export function MarkerContent(props: ComponentProps<"span">) {
  return <span {...props} />
}
