"use client"

import * as React from "react"
import { cn } from "../cn.js"
import { DayPicker } from "react-day-picker"
import { buttonVariants } from "./button.js"
export function Calendar({ className, classNames, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("w-fit rounded-xl border border-border bg-card p-3 font-body text-body text-foreground", className)}
      classNames={{
        months: "relative flex flex-wrap gap-6",
        month: "space-y-3",
        month_caption: "flex h-10 items-center ps-2 pe-24 font-medium",
        nav: "absolute end-0 top-0 flex gap-1",
        button_previous: buttonVariants({ variant: "ghost", size: "icon" }),
        button_next: buttonVariants({ variant: "ghost", size: "icon" }),
        chevron: "size-4 fill-current",
        month_grid: "border-collapse",
        weekdays: "text-muted-foreground",
        weekday: "size-9 text-micro font-normal",
        day: "size-9 p-0 text-center",
        day_button: cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-9 rounded-md font-normal"),
        selected: "rounded-md bg-primary text-primary-foreground [&>button]:bg-primary [&>button]:text-primary-foreground",
        today: "font-semibold underline underline-offset-4",
        outside: "text-muted-foreground opacity-50",
        disabled: "pointer-events-none opacity-30",
        hidden: "invisible",
        range_middle: "rounded-none bg-accent [&>button]:bg-accent [&>button]:text-accent-foreground",
        dropdowns: "flex gap-2",
        dropdown: "rounded-md border border-input bg-background p-1",
        ...classNames,
      }}
      {...props}
    />
  )
}
