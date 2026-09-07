"use client"

import * as React from "react"
import { Calendar } from "./calendar.js"
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js"
import { Button } from "./button.js"
import { CalendarDays } from "lucide-react"
export function DatePicker({
  value,
  onValueChange,
  label = "Choose a date",
  disabled = false,
  calendarProps,
}: {
  value?: Date
  onValueChange: (date: Date | undefined) => void
  label?: string
  disabled?: boolean
  calendarProps?: Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect" | "required">
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} aria-label={value ? `${label}: ${value.toLocaleDateString()}` : label}>
          <CalendarDays className="size-4" />
          {value ? value.toLocaleDateString(undefined, { dateStyle: "medium" }) : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={label} className="w-auto border-0 p-0" align="start">
        <Calendar
          {...calendarProps}
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onValueChange(date)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
