/**
 * The tokens in the shape a React Native `StyleSheet` wants: numbers, not
 * CSS strings, and colours as resolved hex. Derived from `./tokens`, so it
 * cannot drift from the web.
 *
 * Fluid heading steps use their 390px lower bound — a phone IS the clamp
 * minimum. Line-heights are pre-multiplied into points because RN takes an
 * absolute `lineHeight`, not a ratio.
 */
import { colors, colorAliases, resolveColor, type ColorAlias, type ColorRole, type Mode } from "./tokens/colors.js"
import { fonts } from "./tokens/fonts.js"
import { radii } from "./tokens/radii.js"
import { type, textStyles, type TypeStep } from "./tokens/type.js"

function resolved(mode: Mode) {
  const roles = [...Object.keys(colors), ...Object.keys(colorAliases)] as (ColorRole | ColorAlias)[]
  return Object.fromEntries(roles.map((role) => [role, resolveColor(role, mode)])) as {
    [K in ColorRole | ColorAlias]: string
  }
}

export const nativeColors = { light: resolved("light"), dark: resolved("dark") } as const

export const nativeRadii = { md: radii.md, xl: radii.xl } as const

export const nativeType = Object.fromEntries(
  (Object.entries(type) as [string, TypeStep][]).map(([name, step]) => [
    name,
    { fontSize: step.px, lineHeight: Math.round(step.px * step.lineHeight), ...(step.max ? { max: step.max } : {}) },
  ]),
) as { [K in keyof typeof type]: { fontSize: number; lineHeight: number; max?: number } }

/** `text-nav` / `text-eyebrow` as RN text style objects. */
export const nativeTextStyles = Object.fromEntries(
  Object.entries(textStyles).map(([name, s]) => [
    name,
    {
      fontSize: type[s.step].px,
      lineHeight: Math.round(type[s.step].px * type[s.step].lineHeight),
      textTransform: "uppercase" as const,
      letterSpacing: Math.round(parseFloat(s.tracking) * type[s.step].px * 100) / 100,
    },
  ]),
) as { [K in keyof typeof textStyles]: { fontSize: number; lineHeight: number; textTransform: "uppercase"; letterSpacing: number } }

export const nativeFonts = {
  body: fonts.body.family,
  display: fonts.display.family,
  code: fonts.code.family,
} as const

export const native = {
  colors: nativeColors,
  radii: nativeRadii,
  type: nativeType,
  textStyles: nativeTextStyles,
  fonts: nativeFonts,
} as const
