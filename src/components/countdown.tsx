"use client"
import { useState, useEffect } from "react"
export function Countdown({ until, label = "Time remaining" }: { until: string; label?: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const end = Date.parse(until)
  if (!Number.isFinite(end)) return <span>Invalid date</span>
  const seconds = now === null ? null : Math.max(0, Math.floor((end - now) / 1000))
  return (
    <span aria-label={label} className="font-code text-body tabular-nums">
      {seconds === null
        ? "—"
        : seconds === 0
          ? "Started"
          : `${Math.floor(seconds / 86400)}d ${Math.floor(seconds / 3600) % 24}h ${Math.floor(seconds / 60) % 60}m ${seconds % 60}s`}
    </span>
  )
}
