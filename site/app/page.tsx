import { colors, type as typeScale, typeSize, type TypeStep } from "@aisocratic/stoa/tokens"

import { contrast } from "@/lib/contrast"
import { Gallery, type ColorRow, type TypeRow } from "./gallery"

const TEXT_ROLES = new Set(["foreground", "reading", "muted-foreground"])

export default function Page() {
  const colorRows: ColorRow[] = Object.entries(colors).map(([role, pair]) => ({
    role,
    light: pair.light,
    dark: pair.dark,
    contrast: TEXT_ROLES.has(role) || role.startsWith("status-")
      ? { light: contrast(pair.light, colors.background.light), dark: contrast(pair.dark, colors.background.dark) }
      : null,
  }))
  const typeRows: TypeRow[] = (Object.entries(typeScale) as [string, TypeStep][]).map(([name, step]) => ({
    name,
    px: step.max ? `${step.px} → ${step.max}` : String(step.px),
    css: typeSize(step),
    lineHeight: step.lineHeight,
    note: step.note,
  }))
  return <Gallery colors={colorRows} type={typeRows} />
}
