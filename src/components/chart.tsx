"use client"

import { useId, type ReactNode } from "react"
import { cn } from "../cn.js"
import { Card } from "./card.js"

export type ChartDatum = { label: string; value: number; color?: string }
export type ChartKind = "line" | "area" | "bar" | "donut" | "ranking" | "segmented" | "gauge"
export const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function ChartCard({
  title,
  description,
  actions,
  children,
  footer,
  className,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <Card className={cn("min-w-0 p-5", className)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 id={id} className="font-body text-lead font-normal">
            {title}
          </h3>
          {description && <p className="mt-1 text-micro text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      <div role="group" aria-labelledby={id}>
        {children}
      </div>
      {footer && <div className="mt-4 border-t border-border pt-3 text-micro text-muted-foreground">{footer}</div>}
    </Card>
  )
}

/** Small, dependency-free charts. Each graphic includes a readable data table. */
export function Chart({
  data,
  kind = "bar",
  label,
  className,
  formatValue = (value: number) => value.toLocaleString(),
  showValues = true,
}: {
  data: ChartDatum[]
  kind?: ChartKind
  label: string
  className?: string
  formatValue?: (value: number) => string
  showValues?: boolean
}) {
  const id = useId()
  const rows = data.filter((row) => Number.isFinite(row.value))
  const positive = rows.map((row) => ({ ...row, value: Math.max(0, row.value) }))
  const isShare = ["donut", "ranking", "segmented", "gauge"].includes(kind)
  const total = positive.reduce((sum, row) => sum + row.value, 0)
  const fill = (index: number) => rows[index]?.color ?? chartColors[index % chartColors.length]
  const max = Math.max(0, ...rows.map((row) => row.value))
  const min = Math.min(0, ...rows.map((row) => row.value))
  const span = max - min || 1
  const x = (i: number) => 40 + (rows.length === 1 ? 260 : (i / (rows.length - 1)) * 520)
  const y = (value: number) => 190 - ((value - min) / span) * 160
  const points = rows.map((row, i) => `${x(i)},${y(row.value)}`).join(" ")
  let cumulative = 0
  if (!rows.length || (isShare && total === 0 && kind !== "gauge"))
    return (
      <p role="status" className={cn("rounded-md bg-muted p-5 text-body text-muted-foreground", className)}>
        No data for {label.toLowerCase()}.
      </p>
    )
  return (
    <div className={cn("space-y-4", className)}>
      {kind === "ranking" ? (
        <div className="space-y-3">
          {[...positive]
            .sort((a, b) => b.value - a.value)
            .map((row, i) => (
              <div key={`${row.label}-${i}`}>
                <div className="mb-1 flex justify-between gap-3 text-micro">
                  <span>{row.label}</span>
                  <span className="font-code">
                    {formatValue(row.value)} · {((row.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(row.value / total) * 100}%`, background: row.color ?? chartColors[i % 5] }}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : kind === "segmented" ? (
        <div role="img" aria-label={label} className="flex h-8 overflow-hidden rounded-md">
          {positive.map((row, i) => (
            <div
              key={i}
              title={`${row.label}: ${formatValue(row.value)}`}
              style={{ width: `${(row.value / total) * 100}%`, background: fill(i) }}
            />
          ))}
        </div>
      ) : kind === "gauge" ? (
        <div className="flex flex-wrap justify-around gap-5">
          {positive.map((row, i) => {
            const value = Math.min(100, row.value)
            return (
              <div key={i} className="w-28 text-center">
                <svg viewBox="0 0 100 100" role="img" aria-label={`${row.label}: ${value} of 100`}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--muted)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={fill(i)}
                    strokeWidth="8"
                    pathLength="100"
                    strokeDasharray={`${value} 100`}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                  />
                  <text x="50" y="57" textAnchor="middle" fill="currentColor" fontSize="24">
                    {value}
                  </text>
                </svg>
                <p className="text-micro">{row.label}</p>
              </div>
            )
          })}
        </div>
      ) : kind === "donut" ? (
        <svg viewBox="0 0 240 200" className="mx-auto h-52 w-full" role="img" aria-labelledby={id}>
          <title id={id}>{label}</title>
          {positive.map((row, i) => {
            const fraction = (row.value / total) * 100
            const offset = cumulative
            cumulative += fraction
            return (
              <circle
                key={i}
                cx="120"
                cy="100"
                r="72"
                fill="none"
                stroke={fill(i)}
                strokeWidth="24"
                pathLength="100"
                strokeDasharray={`${fraction} ${100 - fraction}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 120 100)"
              >
                <title>{`${row.label}: ${formatValue(row.value)}`}</title>
              </circle>
            )
          })}
          <text x="120" y="105" textAnchor="middle" fill="currentColor" fontSize="22">
            {formatValue(total)}
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 600 225" className="w-full overflow-visible" role="img" aria-labelledby={id}>
          <title id={id}>{label}</title>
          {[min, min + span / 2, min + span].map((value, i) => (
            <g key={i}>
              <line x1="40" x2="580" y1={y(value)} y2={y(value)} stroke="var(--border)" />
              <text x="35" y={y(value) + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize="10">
                {formatValue(value)}
              </text>
            </g>
          ))}
          {kind === "area" && <polygon points={`${x(0)},${y(0)} ${points} ${x(rows.length - 1)},${y(0)}`} fill={fill(0)} opacity="0.15" />}
          {kind !== "bar" && <polyline points={points} fill="none" stroke={fill(0)} strokeWidth="2.5" strokeLinejoin="round" />}
          {rows.map((row, i) => {
            const width = 520 / rows.length
            const bx = 40 + i * width
            return (
              <g key={i}>
                {kind === "bar" ? (
                  <rect
                    x={bx + width * 0.15}
                    y={Math.min(y(row.value), y(0))}
                    width={width * 0.7}
                    height={Math.max(1, Math.abs(y(row.value) - y(0)))}
                    rx="3"
                    fill={fill(i)}
                  >
                    <title>{`${row.label}: ${formatValue(row.value)}`}</title>
                  </rect>
                ) : (
                  <circle cx={x(i)} cy={y(row.value)} r="4" fill={fill(0)}>
                    <title>{`${row.label}: ${formatValue(row.value)}`}</title>
                  </circle>
                )}
                {(rows.length <= 8 || i % Math.ceil(rows.length / 8) === 0) && (
                  <text x={kind === "bar" ? bx + width / 2 : x(i)} y="214" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">
                    {row.label.length > 12 ? row.label.slice(0, 11) + "…" : row.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      )}
      {showValues && kind !== "ranking" && kind !== "gauge" && (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-micro">
          {rows.map((row, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: fill(kind === "line" || kind === "area" ? 0 : i) }} />
              <span>{row.label}</span>
              <span className="font-code">{formatValue(row.value)}</span>
            </li>
          ))}
        </ul>
      )}
      <details className="text-micro text-muted-foreground">
        <summary className="cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-ring">View data</summary>
        <table className="mt-2 w-full text-left">
          <caption className="sr-only">{label}</caption>
          <thead>
            <tr>
              <th scope="col">Label</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <th scope="row" className="py-1 font-normal">
                  {row.label}
                </th>
                <td className="font-code">{formatValue(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
