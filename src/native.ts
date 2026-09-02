/**
 * The tokens in the shape a React Native `StyleSheet` wants: numbers, not
 * CSS strings. Derived from `./tokens`, so it cannot drift from the web.
 *
 * Fluid heading steps use their 390px lower bound — a phone IS the clamp
 * minimum. Line-heights are pre-multiplied into points because RN takes an
 * absolute `lineHeight`, not a ratio.
 */
import { colors, type Mode } from "./tokens/colors.js"
import { fonts } from "./tokens/fonts.js"
import { radii } from "./tokens/radii.js"
import { type, type TypeStep } from "./tokens/type.js"

function palette(mode: Mode) {
  return Object.fromEntries(Object.entries(colors).map(([role, pair]) => [role, pair[mode]])) as {
    [K in keyof typeof colors]: string
  }
}

export const nativeColors = { light: palette("light"), dark: palette("dark") } as const

export const nativeRadii = { sm: radii.sm, base: radii.base, lg: radii.lg, xl: radii.xl, "2xl": radii["2xl"] } as const

export const nativeType = Object.fromEntries(
  (Object.entries(type) as [string, TypeStep][]).map(([name, step]) => [
    name,
    { fontSize: step.px, lineHeight: Math.round(step.px * step.lineHeight), ...(step.max ? { max: step.max } : {}) },
  ]),
) as { [K in keyof typeof type]: { fontSize: number; lineHeight: number; max?: number } }

export const nativeFonts = {
  body: fonts.body.family,
  display: fonts.display.family,
  code: fonts.code.family,
} as const

export const native = { colors: nativeColors, radii: nativeRadii, type: nativeType, fonts: nativeFonts } as const
