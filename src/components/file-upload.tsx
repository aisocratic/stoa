"use client"
import { useId, useState, type ComponentProps } from "react"
import { Input } from "./input.js"
/** Selection only; the caller owns transport and storage. Native accept is a picker hint. */
export function FileUpload({
  label = "Choose files",
  onFilesChange,
  maxBytes,
  ...props
}: Omit<ComponentProps<"input">, "type" | "onChange" | "value"> & {
  label?: string
  onFilesChange: (files: File[]) => void
  maxBytes?: number
}) {
  const generated = useId()
  const id = props.id ?? generated
  const [error, setError] = useState("")
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-body">
        {label}
      </label>
      <Input
        {...props}
        id={id}
        type="file"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : props["aria-describedby"]}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (maxBytes && files.some((file) => file.size > maxBytes)) {
            setError(`Each file must be under ${(maxBytes / 1024 / 1024).toFixed(1)} MB.`)
            e.target.value = ""
            return
          }
          setError("")
          onFilesChange(files)
        }}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-body text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
