import {
  colors,
  colorAliases,
  isMix,
  palette,
  resolveColor,
  roleContrast,
  type as typeScale,
  typeSize,
  type ColorRole,
  type TypeStep,
} from "@aisocratic/design/tokens"

import { Gallery, type ColorRow, type PaletteScale, type TypeRow } from "./gallery"

const TEXT_ROLES = new Set(["foreground", "reading", "muted-foreground"])

const ratio = (a: ColorRole, b: ColorRole, mode: "light" | "dark") => Math.round(roleContrast(a, b, mode) * 10) / 10

export default function Page() {
  const colorRows: ColorRow[] = (Object.entries(colors) as [ColorRole, (typeof colors)[ColorRole]][]).map(([role, def]) => ({
    role,
    ref: isMix(def) ? `mix(${def.mix.of} ${def.mix.amount}%, ${def.mix.with})` : `${def.light} · ${def.dark}`,
    light: resolveColor(role, "light"),
    dark: resolveColor(role, "dark"),
    contrast:
      TEXT_ROLES.has(role) || role.startsWith("status-")
        ? { light: ratio(role, "background", "light"), dark: ratio(role, "background", "dark") }
        : null,
  }))

  const aliasRows = Object.entries(colorAliases).map(([alias, role]) => ({ alias, role }))

  const scales: PaletteScale[] = Object.entries(palette)
    .filter(([, v]) => typeof v !== "string")
    .map(([name, steps]) => ({ name, steps: Object.entries(steps as Record<string, string>).map(([step, hex]) => ({ step, hex })) }))

  const typeRows: TypeRow[] = (Object.entries(typeScale) as [string, TypeStep][]).map(([name, step]) => ({
    name,
    px: step.max ? `${step.px} → ${step.max}` : String(step.px),
    css: typeSize(step),
    lineHeight: step.lineHeight,
    note: step.note,
  }))

  return <Gallery colors={colorRows} aliases={aliasRows} scales={scales} type={typeRows} />
}
