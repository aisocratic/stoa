export {
  colors,
  colorAliases,
  colorCss,
  resolveColor,
  roleContrast,
  isMix,
  type ColorRole,
  type ColorAlias,
  type ColorPair,
  type ColorMix,
  type ColorDef,
  type Mode,
} from "./colors.js"
export { palette, paletteHex, paletteEntries, paletteVar, type PaletteRef } from "./palette.js"
export { contrast, luminance, mixOklab } from "./color-math.js"
export { type, typeSize, textStyles, FLUID_RANGE, type TypeStep, type TypeStepName, type TextStyleName } from "./type.js"
export { radii, radiusAliases, type RadiusRung } from "./radii.js"
export { fonts, fontStack, type FontRole, type FontSpec } from "./fonts.js"
export { shell } from "./shell.js"
export { brand, brandGradientCss } from "./brand.js"

import { colors } from "./colors.js"
import { palette } from "./palette.js"
import { type, textStyles } from "./type.js"
import { radii } from "./radii.js"
import { fonts } from "./fonts.js"
import { shell } from "./shell.js"
import { brand } from "./brand.js"

/** Everything, as one object — the shape `tokens.json` is generated from. */
export const tokens = { palette, colors, type, textStyles, radii, fonts, shell, brand } as const
