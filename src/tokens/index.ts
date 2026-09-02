export { colors, type ColorRole, type ColorPair, type Mode } from "./colors.js"
export { type, typeSize, FLUID_RANGE, type TypeStep, type TypeStepName } from "./type.js"
export { radii, type RadiusRung } from "./radii.js"
export { fonts, fontStack, type FontRole, type FontSpec } from "./fonts.js"
export { shell } from "./shell.js"
export { brand, brandGradientCss } from "./brand.js"

import { colors } from "./colors.js"
import { type } from "./type.js"
import { radii } from "./radii.js"
import { fonts } from "./fonts.js"
import { shell } from "./shell.js"
import { brand } from "./brand.js"

/** Everything, as one object — the shape `tokens.json` is generated from. */
export const tokens = { colors, type, radii, fonts, shell, brand } as const
